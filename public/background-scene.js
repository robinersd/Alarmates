/* ==========================================================================
   AlarmMates — Kage-Style Dynamic 3D WebGL Background & Motion Transitions
   Features:
   - Full-viewport WebGL Three.js engine (#gl)
   - Atmospheric sky gradient & star mist
   - Drifting additive haze slabs
   - 350+ rising luminous motes & embers (Electric Blue, Cyan & White)
   - Interactive Cursor Wisps (motes trailing pointer with physics & curl)
   - Dynamic noise grain generator (#grain) & Vignette (#vignette)
   - Cinematic scroll-triggered reveal transitions (data-rv, mask-line, ease-out)
   - Responsive & adaptive to Dark / Light themes
   ========================================================================== */

import * as THREE from "./assets/vendor/hero3d/vendor/three.module.js";

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const sat = (v) => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => {
  const t = sat((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const damp = (cur, to, rate, dt) => lerp(cur, to, 1 - Math.exp(-rate * dt));
const TAU = Math.PI * 2;

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cvs(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function tx(canvasEl) {
  const t = new THREE.CanvasTexture(canvasEl);
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  return t;
}

/* Glow texture generator */
function texGlow(c0, c1) {
  const c = cvs(128, 128);
  const cx = c.getContext("2d");
  const g = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, c0);
  g.addColorStop(0.35, c1);
  g.addColorStop(1, "rgba(0,0,0,0)");
  cx.fillStyle = g;
  cx.fillRect(0, 0, 128, 128);
  return c;
}

/* Wisp point particle texture */
function texWisp() {
  const S = 96;
  const c = cvs(S, S);
  const cx = c.getContext("2d");
  const half = S / 2;
  const g = cx.createRadialGradient(half, half, 0, half, half, half);
  g.addColorStop(0, "rgba(255, 255, 255, 1)");
  g.addColorStop(0.14, "rgba(147, 197, 253, 0.88)");
  g.addColorStop(0.38, "rgba(37, 99, 235, 0.42)");
  g.addColorStop(0.72, "rgba(30, 58, 138, 0.12)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  cx.fillStyle = g;
  cx.fillRect(0, 0, S, S);
  return c;
}

export function initProceduralGrain() {
  const grainEl = document.getElementById("grain");
  if (!grainEl) return;
  const c = cvs(180, 180);
  const cx = c.getContext("2d");
  const imgData = cx.createImageData(180, 180);
  const buf = new Uint32Array(imgData.data.buffer);
  for (let i = 0; i < buf.length; i++) {
    const val = (Math.random() * 255) | 0;
    buf[i] = (255 << 24) | (val << 16) | (val << 8) | val;
  }
  cx.putImageData(imgData, 0, 0);
  grainEl.style.backgroundImage = `url(${c.toDataURL()})`;
}

export function initBackgroundScene() {
  const canvas = document.getElementById("gl");
  if (!canvas) return;

  const COARSE = window.matchMedia("(hover: none)").matches;
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 300);
  camera.position.set(0, 0, 15);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !COARSE,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);

  const WORLD = {
    uT: { value: 0 },
    haze: [],
    embers: null,
    ripples: [],
    stars: null,
  };

  /* 1. Deep Blue Atmospheric Background Plane */
  const skyCvs = cvs(512, 512);
  const skyCtx = skyCvs.getContext("2d");
  function updateSkyTexture(isDark = true) {
    const grd = skyCtx.createLinearGradient(0, 0, 0, 512);
    if (isDark) {
      grd.addColorStop(0, "#030612");
      grd.addColorStop(0.45, "#060f26");
      grd.addColorStop(0.85, "#09173d");
      grd.addColorStop(1, "#050a1c");
    } else {
      grd.addColorStop(0, "#e8f2ff");
      grd.addColorStop(0.5, "#f0f6ff");
      grd.addColorStop(1, "#dbeafe");
    }
    skyCtx.fillStyle = grd;
    skyCtx.fillRect(0, 0, 512, 512);
  }
  updateSkyTexture(document.documentElement.getAttribute("data-theme") !== "light");
  const skyTex = tx(skyCvs);
  const skyMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 80),
    new THREE.MeshBasicMaterial({ map: skyTex, depthWrite: false, depthTest: false })
  );
  skyMesh.position.set(0, 0, -45);
  scene.add(skyMesh);

  /* 2. Drifting Translucent Haze Slabs */
  const hazeTex = tx(
    texGlow("rgba(59, 130, 246, 0.35)", "rgba(37, 99, 235, 0.12)")
  );
  const rnd = mulberry32(42);
  for (let i = 0; i < (COARSE ? 3 : 6); i++) {
    const s = 14 + rnd() * 18;
    const h = new THREE.Mesh(
      new THREE.PlaneGeometry(s, s * 0.55),
      new THREE.MeshBasicMaterial({
        map: hazeTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.15 + rnd() * 0.15,
      })
    );
    h.position.set((rnd() - 0.5) * 36, -8 + rnd() * 20, -18 + rnd() * 15);
    h.userData = {
      sp: 0.05 + rnd() * 0.1,
      ph: rnd() * TAU,
      x0: h.position.x,
      amp: 2 + rnd() * 3,
    };
    scene.add(h);
    WORLD.haze.push(h);
  }

  /* 3. Rising Glowing Motes & Embers (Vertex + Fragment Shader) */
  const N = COARSE ? 140 : 360;
  const pos = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  const colType = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    pos[i * 3] = (rnd() - 0.5) * 38;
    pos[i * 3 + 1] = (rnd() - 0.5) * 26;
    pos[i * 3 + 2] = -14 + rnd() * 22;
    seed[i] = rnd();
    colType[i] = rnd() < 0.35 ? 0.0 : rnd() < 0.75 ? 1.0 : 2.0; // 0: Cyan, 1: Electric Blue, 2: Pure White
  }

  const emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  emberGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  emberGeo.setAttribute("aColType", new THREE.BufferAttribute(colType, 1));

  const emberMat = new THREE.ShaderMaterial({
    uniforms: {
      uT: WORLD.uT,
      uTex: { value: tx(texWisp()) },
      uSize: { value: height * 0.55 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexShader: `
      attribute float aSeed;
      attribute float aColType;
      uniform float uT;
      uniform float uSize;
      varying float vA;
      varying float vCol;

      void main() {
        vec3 p = position;
        float h = 26.0;
        p.y = mod(p.y + uT * (0.16 + aSeed * 0.32) + 13.0, h) - 13.0;
        p.x += sin(uT * 0.42 + aSeed * 19.0) * 0.95;
        p.z += cos(uT * 0.35 + aSeed * 15.0) * 0.75;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vA = (0.28 + aSeed * 0.72) * smoothstep(13.0, 8.0, p.y) * smoothstep(-13.0, -9.0, p.y);
        vCol = aColType;
        gl_PointSize = uSize * (0.012 + aSeed * 0.022) / max(-mv.z, 0.6);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTex;
      varying float vA;
      varying float vCol;

      void main() {
        vec4 t = texture2D(uTex, gl_PointCoord);
        vec3 col = vec3(1.0);
        if (vCol < 0.5) {
          col = vec3(0.38, 0.78, 1.0); // Cyan Sky
        } else if (vCol < 1.5) {
          col = vec3(0.18, 0.48, 1.0); // Electric Blue
        } else {
          col = vec3(0.95, 0.98, 1.0); // Luminous White
        }
        gl_FragColor = vec4(t.rgb * col * 1.5, t.a * vA * 0.9);
      }
    `,
  });

  const emberPoints = new THREE.Points(emberGeo, emberMat);
  emberPoints.frustumCulled = false;
  scene.add(emberPoints);
  WORLD.embers = emberPoints;

  /* 4. Ambient Ripples */
  const rippleCvs = cvs(128, 128);
  const rx = rippleCvs.getContext("2d");
  const rg = rx.createRadialGradient(64, 64, 46, 64, 64, 63);
  rg.addColorStop(0, "rgba(59, 130, 246, 0)");
  rg.addColorStop(0.65, "rgba(59, 130, 246, 0.45)");
  rg.addColorStop(0.85, "rgba(147, 197, 253, 0.8)");
  rg.addColorStop(1, "rgba(59, 130, 246, 0)");
  rx.fillStyle = rg;
  rx.fillRect(0, 0, 128, 128);
  const rippleTex = tx(rippleCvs);

  for (let i = 0; i < 4; i++) {
    const rp = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({
        map: rippleTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0,
      })
    );
    rp.rotation.x = -Math.PI / 2.2;
    rp.position.set((rnd() - 0.5) * 18, -6.5, -4 + rnd() * 10);
    rp.userData = {
      t: rnd() * 5,
      dur: 4 + rnd() * 3,
      scaleMax: 3.5 + rnd() * 3,
    };
    scene.add(rp);
    WORLD.ripples.push(rp);
  }

  /* 5. Interactive Cursor Wisps */
  const WISP_D = 3.4;
  const WISP_N = COARSE ? 40 : 160;
  const WISP = {
    list: [],
    i: 0,
    acc: 0,
    ex: 0,
    ey: 0,
    lx: 0,
    ly: 0,
    idle: 0,
    seen: false,
    targetX: 0,
    targetY: 0,
    mesh: null,
  };

  const wispGeo = new THREE.BufferGeometry();
  wispGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(WISP_N * 3), 3));
  wispGeo.setAttribute("aA", new THREE.BufferAttribute(new Float32Array(WISP_N), 1));
  wispGeo.setAttribute("aS", new THREE.BufferAttribute(new Float32Array(WISP_N), 1));

  const wispMat = new THREE.ShaderMaterial({
    uniforms: {
      uTex: { value: tx(texWisp()) },
      uPx: { value: height },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    vertexShader: `
      attribute float aA;
      attribute float aS;
      uniform float uPx;
      varying float vA;

      void main() {
        vA = aA;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uPx * aS / max(-mv.z, 0.4);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTex;
      varying float vA;

      void main() {
        if (vA <= 0.0) discard;
        vec4 t = texture2D(uTex, gl_PointCoord);
        gl_FragColor = vec4(t.rgb * vec3(0.5, 0.85, 1.2), t.a * vA);
      }
    `,
  });

  const wispPoints = new THREE.Points(wispGeo, wispMat);
  wispPoints.frustumCulled = false;
  camera.add(wispPoints);
  scene.add(camera);
  WISP.mesh = wispPoints;

  for (let i = 0; i < WISP_N; i++) {
    WISP.list.push({ life: 0, max: 1, vx: 0, vy: 0, sz: 0, ph: 0 });
  }

  function wispPoint(nx, ny) {
    const hh = Math.tan((camera.fov * Math.PI) / 360) * WISP_D;
    return [nx * hh * camera.aspect, ny * hh];
  }

  /* Pointer tracking */
  window.addEventListener(
    "pointermove",
    (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      WISP.targetX = nx;
      WISP.targetY = ny;
    },
    { passive: true }
  );

  function updateWisps(dt, clock) {
    if (!WISP.mesh || REDUCE) return;
    const g = WISP.mesh.geometry;
    const P = g.attributes.position.array;
    const A = g.attributes.aA.array;
    const S = g.attributes.aS.array;
    const L = WISP.list;
    const num = L.length;

    const pt = wispPoint(WISP.targetX, WISP.targetY);
    if (!WISP.seen) {
      WISP.ex = WISP.lx = pt[0];
      WISP.ey = WISP.ly = pt[1];
      WISP.seen = true;
    }

    WISP.ex = damp(WISP.ex, pt[0], 16, dt);
    WISP.ey = damp(WISP.ey, pt[1], 16, dt);

    const dx = WISP.ex - WISP.lx;
    const dy = WISP.ey - WISP.ly;
    const moved = Math.hypot(dx, dy);
    const ang = moved > 1e-5 ? Math.atan2(dy, dx) : 0;

    const spawn = (x, y, a, weak) => {
      const i = WISP.i;
      WISP.i = (i + 1) % num;
      const w = L[i];
      const k = i * 3;
      P[k] = x + (Math.random() + Math.random() - 1) * 0.18;
      P[k + 1] = y + (Math.random() + Math.random() - 1) * 0.18;
      P[k + 2] = -WISP_D + (Math.random() - 0.5) * 0.6;
      w.life = 0;
      w.max = (weak ? 1.6 : 1.2) + Math.random() * 0.9;
      w.vx = -Math.cos(a) * 0.07 + (Math.random() - 0.5) * 0.25;
      w.vy = -Math.sin(a) * 0.07 + (Math.random() - 0.5) * 0.22 + 0.02;
      w.sz = (weak ? 0.016 : 0.024) + Math.random() * 0.022;
      w.ph = Math.random() * TAU;
    };

    WISP.acc += moved;
    const STEP = 0.035;
    let guard = 0;
    while (WISP.acc >= STEP && guard++ < 12) {
      WISP.acc -= STEP;
      const t = moved > 1e-6 ? Math.min(1, (guard * STEP) / moved) : 0;
      spawn(WISP.lx + dx * t, WISP.ly + dy * t, ang, false);
    }

    WISP.idle += dt;
    if (WISP.idle > 0.45) {
      WISP.idle = 0;
      spawn(WISP.ex, WISP.ey, Math.random() * TAU, true);
    }
    WISP.lx = WISP.ex;
    WISP.ly = WISP.ey;

    for (let i = 0; i < num; i++) {
      const w = L[i];
      const k = i * 3;
      if (w.life >= w.max) {
        A[i] = 0;
        continue;
      }
      w.life += dt;
      const u = w.life / w.max;
      P[k] += (w.vx + Math.sin(clock * 1.3 + w.ph) * 0.12) * dt;
      P[k + 1] += (w.vy + Math.cos(clock * 1.1 + w.ph * 1.5) * 0.1) * dt;
      w.vx *= 1 - 0.5 * dt;
      w.vy = w.vy * (1 - 0.5 * dt) + 0.02 * dt;
      A[i] = smooth(0, 0.12, u) * (1 - smooth(0.3, 1, u)) * 0.9;
      S[i] = w.sz * (1 + u * 0.5);
    }

    g.attributes.position.needsUpdate = true;
    g.attributes.aA.needsUpdate = true;
    g.attributes.aS.needsUpdate = true;
  }

  /* Parallax Scroll tracking */
  let scrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
    },
    { passive: true }
  );

  /* Theme Sync */
  const observerTheme = new MutationObserver(() => {
    const isDark = document.documentElement.getAttribute("data-theme") !== "light";
    updateSkyTexture(isDark);
    skyTex.needsUpdate = true;
  });
  observerTheme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  /* Window Resize */
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    emberMat.uniforms.uSize.value = height * 0.55;
    wispMat.uniforms.uPx.value = height;
  });

  /* Main Animation Loop */
  let lastTime = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    if (document.hidden) return;

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    const clock = now * 0.001;

    WORLD.uT.value = clock;

    /* Camera Parallax with scroll */
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollFrac = scrollY / maxScroll;
    camera.position.y = damp(camera.position.y, -scrollFrac * 6.0, 3, dt);
    camera.position.x = damp(camera.position.x, WISP.targetX * 0.6, 2, dt);

    /* Haze animation */
    WORLD.haze.forEach((h) => {
      h.position.x = h.userData.x0 + Math.sin(clock * h.userData.sp + h.userData.ph) * h.userData.amp;
    });

    /* Ripples animation */
    WORLD.ripples.forEach((rp) => {
      rp.userData.t += dt;
      if (rp.userData.t > rp.userData.dur) rp.userData.t = 0;
      const prog = rp.userData.t / rp.userData.dur;
      const s = 1 + prog * rp.userData.scaleMax;
      rp.scale.set(s, s, 1);
      rp.material.opacity = smooth(0, 0.2, prog) * (1 - smooth(0.5, 1, prog)) * 0.35;
    });

    /* Wisps update */
    updateWisps(dt, clock);

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
}

/* ==========================================================================
   CINEMATIC SCROLL REVEAL OBSERVER (Kage-style [data-rv] -> .rv-in)
   ========================================================================== */
export function initRevealTransitions() {
  const elements = document.querySelectorAll("[data-rv]");
  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((el) => el.classList.add("rv-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("rv-in");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -20px 0px",
      threshold: 0.05,
    }
  );

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("rv-in");
    } else {
      observer.observe(el);
    }
  });
}
