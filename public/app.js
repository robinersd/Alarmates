/* ==========================================================================
   AlarmMates Official Website — Interactive 3D, Motion Physics, Real-Time APK
    Counter, Smart Mobile/Desktop QR Router & 60fps Chibi Mascot Lip-Sync
   ========================================================================== */

import * as THREE from "./assets/vendor/hero3d/vendor/three.module.js";

// ---------------------------------------------------------------------------
// 1. THEME TOGGLE (modern-web-guidance: dark-mode-toggle via <meta name="color-scheme">)
// ---------------------------------------------------------------------------
const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");

function getRenderedScheme() {
  const content = colorSchemeMeta?.content || "light dark";
  if (content === "dark" || content === "light") return content;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function syncThemeIcon() {
  const current = getRenderedScheme();
  document.documentElement.setAttribute("data-theme", current);
  if (themeIcon) {
    themeIcon.className = current === "dark" ? "ph ph-sun-dim" : "ph ph-moon-stars";
  }
}

syncThemeIcon();

themeToggleBtn?.addEventListener("click", () => {
  const currentRendered = getRenderedScheme();
  const target = currentRendered === "dark" ? "light" : "dark";
  const sysPref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  try {
    if (target === sysPref) {
      localStorage.removeItem("color-scheme");
      colorSchemeMeta.content = "light dark";
    } else {
      localStorage.setItem("color-scheme", target);
      colorSchemeMeta.content = target;
    }
  } catch {
    colorSchemeMeta.content = target;
  }
  syncThemeIcon();
});

window.addEventListener("storage", (event) => {
  if (event.key === "color-scheme" && colorSchemeMeta) {
    colorSchemeMeta.content = event.newValue ?? "light dark";
    syncThemeIcon();
  }
});

// ---------------------------------------------------------------------------
// 2. MOBILE MENU TOGGLE (landing-page-design B7 + html inert attribute)
// ---------------------------------------------------------------------------
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenuIcon = document.getElementById("mobileMenuIcon");
const mobileMenuPanel = document.getElementById("mobileMenuPanel");

function setMobileMenuOpen(open) {
  if (!mobileMenuPanel || !mobileMenuBtn) return;
  mobileMenuPanel.classList.toggle("is-open", open);
  mobileMenuBtn.setAttribute("aria-expanded", String(open));
  if (open) {
    mobileMenuPanel.removeAttribute("inert");
    if (mobileMenuIcon) mobileMenuIcon.className = "ph ph-x";
  } else {
    mobileMenuPanel.setAttribute("inert", "");
    if (mobileMenuIcon) mobileMenuIcon.className = "ph ph-list";
  }
}

mobileMenuBtn?.addEventListener("click", () => {
  const isOpen = mobileMenuPanel?.classList.contains("is-open");
  setMobileMenuOpen(!isOpen);
});

mobileMenuPanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileMenuOpen(false));
});

// ---------------------------------------------------------------------------
// 3. LIGHT-DISMISS DIALOG FALLBACK (modern-web-guidance: light-dismiss-a-dialog)
// ---------------------------------------------------------------------------
const apkConfigModal = document.getElementById("apkConfigModal");
const openApkConfigBtn = document.getElementById("openApkConfigBtn");

openApkConfigBtn?.addEventListener("click", () => {
  apkConfigModal?.showModal();
});

if (apkConfigModal && !("closedBy" in HTMLDialogElement.prototype)) {
  apkConfigModal.addEventListener("click", (event) => {
    if (event.target !== apkConfigModal) return;
    const rect = apkConfigModal.getBoundingClientRect();
    const isDialogContent =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (isDialogContent) return;
    apkConfigModal.close();
  });
}

// ---------------------------------------------------------------------------
// 4. CHIBI TRISTAN INTERACTIVE MASCOT & 60FPS WEB AUDIO LIP-SYNC ENGINE
// ---------------------------------------------------------------------------
const chibiSpeechBubble = document.getElementById("chibiSpeechBubble");
const chibiSpeechText = document.getElementById("chibiSpeechText");
const chibiEmoteBadge = document.getElementById("chibiEmoteBadge");
const chibiCompanionImg = document.getElementById("chibiCompanionImg");
const chibiSpeakNowBtn = document.getElementById("chibiSpeakNowBtn");
const chibiSpeakBtnLabel = document.getElementById("chibiSpeakBtnLabel");
const chibiNextPoseBtn = document.getElementById("chibiNextPoseBtn");
const chibiAvatarTrigger = document.getElementById("chibiAvatarTrigger");
const chibiVoiceStateText = document.getElementById("chibiVoiceStateText");
const closeChibiBubbleBtn = document.getElementById("closeChibiBubbleBtn");

const MASCOT_POSES = [
  {
    pose: "boy_pose_6_wave_dev",
    emote: "👋",
    audio: "./assets/audio/scene_02_dev_intro_english.mp3",
    text: "By the way, hi! I am Tristan, a Fourth Year Computer Engineering student and developer of AlarmMates!"
  },
  {
    pose: "boy_pose_7_pointing",
    emote: "⏰",
    audio: "./assets/audio/scene_01_hook_english.mp3",
    text: "Did you know there is an all in one smart alarm clock? Scan the QR code on desktop or open on mobile to auto download!"
  },
  {
    pose: "boy_pose_8_mic_ai",
    emote: "🎙️",
    audio: "./assets/audio/scene_04_ai_assistant_english.mp3",
    text: "With the AlarmMates AI Assistant, just speak what time you want to wake up and it sets your alarm automatically!"
  },
  {
    pose: "boy_pose_2_shocked",
    emote: "😱",
    audio: "./assets/audio/scene_05_missions_scan_english.mp3",
    text: "Wake up your brain with 11 Wake Up Missions! Scan your real computer mouse on live camera before the alarm stops!"
  },
  {
    pose: "boy_pose_3_tech",
    emote: "💻",
    audio: "./assets/audio/scene_06_study_squad_english.mp3",
    text: "Stay focused with the Study Pomodoro Timer and wake up together with your friends using Squad Alarms!"
  },
  {
    pose: "boy_pose_4_alarm",
    emote: "🪙",
    audio: "./assets/audio/scene_07_watch_ads_rewards_english.mp3",
    text: "Want all Premium Features for free? Tap Watch Ads to earn 2 points per ad and unlock every 50 point feature!"
  },
  {
    pose: "boy_pose_5_thumbsup",
    emote: "🏆",
    audio: "./assets/audio/scene_08_outro_english.mp3",
    text: "Download and try AlarmMates today! Wake up early, stay focused, and succeed every single day!"
  }
];

let currentMascotIndex = 0;
let activePoseBase = MASCOT_POSES[0].pose;
let activeAudioUrl = MASCOT_POSES[0].audio;
let audioCtx = null;
let currentAudioEl = null;
let analyserNode = null;
let lipSyncRafId = null;

if (window.innerWidth <= 640 && chibiSpeechBubble) {
  chibiSpeechBubble.classList.add("is-hidden");
}

function setMascotMouthSprite(poseBase, mouthState = "closed") {
  if (!chibiCompanionImg) return;
  chibiCompanionImg.src = `./assets/stickers/${poseBase}_${mouthState}.png`;
}

function updateMascotState(poseObj, showBubble = true) {
  activePoseBase = poseObj.pose;
  activeAudioUrl = poseObj.audio;
  if (chibiEmoteBadge) chibiEmoteBadge.textContent = poseObj.emote || "✨";
  if (chibiSpeechText) chibiSpeechText.textContent = poseObj.text;
  setMascotMouthSprite(activePoseBase, "closed");
  if (showBubble && chibiSpeechBubble) {
    chibiSpeechBubble.classList.remove("is-hidden");
  }
}

function stopMascotAudio() {
  if (lipSyncRafId) {
    cancelAnimationFrame(lipSyncRafId);
    lipSyncRafId = null;
  }
  if (currentAudioEl) {
    currentAudioEl.pause();
    currentAudioEl.currentTime = 0;
    currentAudioEl = null;
  }
  setMascotMouthSprite(activePoseBase, "closed");
  if (chibiSpeakBtnLabel) chibiSpeakBtnLabel.textContent = "Speak Tour";
  if (chibiVoiceStateText) chibiVoiceStateText.textContent = "Talk";
}

function playMascotVoice(audioUrl, poseBase, lineText, emoteIcon = "🎙️") {
  stopMascotAudio();
  activePoseBase = poseBase || activePoseBase;
  activeAudioUrl = audioUrl || activeAudioUrl;
  // Zero text bubble display per user instruction
  const audio = new Audio(activeAudioUrl);
  audio.crossOrigin = "anonymous";
  currentAudioEl = audio;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }

  if (audioCtx) {
    if (audioCtx.state === "suspended") audioCtx.resume();
    const source = audioCtx.createMediaElementSource(audio);
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 256;
    source.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    const tickLipSync = () => {
      if (!currentAudioEl || currentAudioEl.paused || currentAudioEl.ended) {
        setMascotMouthSprite(activePoseBase, "closed");
        return;
      }
      analyserNode.getByteTimeDomainData(dataArray);
      let sumSq = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const norm = (dataArray[i] - 128) / 128;
        sumSq += norm * norm;
      }
      const rms = Math.sqrt(sumSq / dataArray.length);
      let mouth = "closed";
      if (rms > 0.085) mouth = "open";
      else if (rms > 0.03) mouth = "half";
      setMascotMouthSprite(activePoseBase, mouth);

      // Update active card in Developer Sticker Studio if matching
      const activeStudioImg = document.querySelector(`.sticker-pose-card[data-pose="${activePoseBase}"] img`);
      if (activeStudioImg) {
        activeStudioImg.src = `./assets/stickers/${activePoseBase}_${mouth}.png`;
      }

      lipSyncRafId = requestAnimationFrame(tickLipSync);
    };

    audio.addEventListener("play", () => {
      if (chibiSpeakBtnLabel) chibiSpeakBtnLabel.textContent = "Stop Voice";
      if (chibiVoiceStateText) chibiVoiceStateText.textContent = "Live";
      tickLipSync();
    });
  }

  audio.addEventListener("ended", () => {
    stopMascotAudio();
  });

  audio.play().catch(() => {
    stopMascotAudio();
  });
}

chibiSpeakNowBtn?.addEventListener("click", () => {
  if (currentAudioEl && !currentAudioEl.paused) {
    stopMascotAudio();
  } else {
    playMascotVoice(activeAudioUrl, activePoseBase, chibiSpeechText?.textContent);
  }
});

chibiAvatarTrigger?.addEventListener("click", () => {
  if (currentAudioEl && !currentAudioEl.paused) {
    stopMascotAudio();
  } else {
    playMascotVoice(activeAudioUrl, activePoseBase);
  }
});

chibiNextPoseBtn?.addEventListener("click", () => {
  currentMascotIndex = (currentMascotIndex + 1) % MASCOT_POSES.length;
  const nextObj = MASCOT_POSES[currentMascotIndex];
  updateMascotState(nextObj, true);
  playMascotVoice(nextObj.audio, nextObj.pose, nextObj.text, nextObj.emote);
});

closeChibiBubbleBtn?.addEventListener("click", () => {
  chibiSpeechBubble?.classList.add("is-hidden");
});

// Developer Studio 8-Pose Sticker Grid Click Handlers
document.querySelectorAll(".sticker-pose-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".sticker-pose-card").forEach((c) => c.classList.remove("is-active"));
    card.classList.add("is-active");
    const pose = card.getAttribute("data-pose") || "boy_pose_6_wave_dev";
    const audio = card.getAttribute("data-audio") || "./assets/audio/scene_02_dev_intro_english.mp3";
    const line = card.getAttribute("data-line") || "";
    playMascotVoice(audio, pose, line, "🎙️");
  });
});

document.getElementById("playTristanIntroVoiceBtn")?.addEventListener("click", () => {
  playMascotVoice(
    "./assets/audio/scene_02_dev_intro_english.mp3",
    "boy_pose_6_wave_dev",
    "By the way, hi! I am Tristan, a Fourth Year Computer Engineering student and developer of AlarmMates!",
    "👋"
  );
});

// ---------------------------------------------------------------------------
// 5. SMART DEVICE DETECTOR, QR CODE GENERATOR & REAL-TIME APK COUNTER
// ---------------------------------------------------------------------------
const tabDesktopQr = document.getElementById("tabDesktopQr");
const tabMobileAuto = document.getElementById("tabMobileAuto");
const panelDesktopQr = document.getElementById("panelDesktopQr");
const panelMobileAuto = document.getElementById("panelMobileAuto");
const heroQrSvgContainer = document.getElementById("heroQrSvgContainer");
const qrTargetUrlText = document.getElementById("qrTargetUrlText");
const heroDownloadCount = document.getElementById("heroDownloadCount");
const mobileDownloadCount = document.getElementById("mobileDownloadCount");
const desktopDownloadCount = document.getElementById("desktopDownloadCount");
const lastDownloadBadge = document.getElementById("lastDownloadBadge");
const apkVersionBadge = document.getElementById("apkVersionBadge");
const mobileSizeBadge = document.getElementById("mobileSizeBadge");
const githubStatusLabel = document.getElementById("githubStatusLabel");

let currentServerStats = {
  totalDownloads: 0,
  mobileDownloads: 0,
  desktopDownloads: 0,
  apkVersion: "v1.0.4",
  apkSizeMb: "28.4 MB",
  githubApkUrl: "",
  lanIp: window.location.hostname || "127.0.0.1",
  port: window.location.port || "3000"
};

function setApkPanelMode(mode) {
  const isMobileMode = mode === "mobile";
  tabDesktopQr?.classList.toggle("is-active", !isMobileMode);
  tabDesktopQr?.setAttribute("aria-selected", String(!isMobileMode));
  tabMobileAuto?.classList.toggle("is-active", isMobileMode);
  tabMobileAuto?.setAttribute("aria-selected", String(isMobileMode));

  if (panelDesktopQr) panelDesktopQr.style.display = isMobileMode ? "none" : "grid";
  if (panelMobileAuto) panelMobileAuto.style.display = isMobileMode ? "flex" : "none";
}

tabDesktopQr?.addEventListener("click", () => setApkPanelMode("desktop"));
tabMobileAuto?.addEventListener("click", () => setApkPanelMode("mobile"));

function renderQrCodeForState() {
  if (!heroQrSvgContainer) return;
  const hasOfficialApk = Boolean(currentServerStats.githubApkUrl && currentServerStats.githubApkUrl.startsWith("http"));
  const directBtn = document.getElementById("directApkDownloadBtn");
  const mobileBigBtn = document.getElementById("mobileBigDownloadBtn");
  const directBtnText = document.getElementById("directApkBtnText");
  const mobileBigBtnText = document.getElementById("mobileBigBtnText");

  if (!hasOfficialApk) {
    heroQrSvgContainer.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 12px; background: var(--bg-surface-2); border-radius: var(--rad-md); color: var(--text-muted);">
        <i class="ph ph-qr-code" style="font-size: 36px; margin-bottom: 6px; opacity: 0.45;" aria-hidden="true"></i>
        <span class="caption-4" style="color: var(--text-secondary);">APK Coming Soon</span>
      </div>
    `;
    if (directBtn) {
      directBtn.disabled = true;
      directBtn.style.opacity = "0.55";
      directBtn.style.cursor = "not-allowed";
    }
    if (mobileBigBtn) {
      mobileBigBtn.disabled = true;
      mobileBigBtn.style.opacity = "0.55";
      mobileBigBtn.style.cursor = "not-allowed";
    }
    return;
  }

  if (directBtn) {
    directBtn.disabled = false;
    directBtn.style.opacity = "1";
    directBtn.style.cursor = "pointer";
  }
  if (directBtnText) {
    directBtnText.innerHTML = `Download APK directly (<span id="apkVersionBadge">${currentServerStats.apkVersion || "v1.0.4"}</span>)`;
  }
  if (mobileBigBtn) {
    mobileBigBtn.disabled = false;
    mobileBigBtn.style.opacity = "1";
    mobileBigBtn.style.cursor = "pointer";
  }
  if (mobileBigBtnText) {
    mobileBigBtnText.textContent = "Download AlarmMates APK now";
  }

  if (window.AlarmMatesQR) {
    heroQrSvgContainer.innerHTML = window.AlarmMatesQR.renderQrSvg(currentServerStats.githubApkUrl, "#0F0D1D", "#FFFFFF");
  }
}

function updateStatsUI(data, isLiveIncrement = false) {
  currentServerStats = { ...currentServerStats, ...data };
  const hasOfficialApk = Boolean(currentServerStats.githubApkUrl && currentServerStats.githubApkUrl.startsWith("http"));
  const displayedTotal = hasOfficialApk ? currentServerStats.totalDownloads : 0;

  if (heroDownloadCount) {
    heroDownloadCount.textContent = String(displayedTotal);
    if (isLiveIncrement && hasOfficialApk) {
      heroDownloadCount.classList.add("is-bumping");
      setTimeout(() => heroDownloadCount.classList.remove("is-bumping"), 350);
    }
  }
  if (apkVersionBadge) apkVersionBadge.textContent = currentServerStats.apkVersion || "v1.0.4";
  if (mobileSizeBadge) {
    mobileSizeBadge.textContent = hasOfficialApk
      ? `${currentServerStats.apkSizeMb || "28.4 MB"} · Android 8.0+`
      : "Android 8.0+";
  }
  if (githubStatusLabel) {
    githubStatusLabel.textContent = hasOfficialApk
      ? "GitHub APK Linked ✓"
      : "GitHub APK Settings";
  }

  renderQrCodeForState();
}

async function triggerApkDownload(source = "web") {
  const hasOfficialApk = Boolean(currentServerStats.githubApkUrl && currentServerStats.githubApkUrl.startsWith("http"));
  if (!hasOfficialApk) {
    return;
  }
  try {
    const res = await fetch(`/api/download-apk?source=${encodeURIComponent(source)}&mode=json`);
    if (res.ok) {
      const info = await res.json();
      if (!info.ok) return;
      updateStatsUI(info, true);
      const a = document.createElement("a");
      a.href = info.downloadUrl;
      a.setAttribute("download", "AlarmMates-release.apk");
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  } catch {}
}

document.getElementById("directApkDownloadBtn")?.addEventListener("click", () => triggerApkDownload("desktop"));
document.getElementById("mobileBigDownloadBtn")?.addEventListener("click", () => triggerApkDownload("qr"));
document.getElementById("finalDirectDownloadBtn")?.addEventListener("click", () => triggerApkDownload("desktop"));

// Start Mobile Auto-Download Sequence (only downloads if official APK is published)
function startMobileAutoDownloadFlow(source = "qr") {
  setApkPanelMode("mobile");
  if (currentServerStats.githubApkUrl && currentServerStats.githubApkUrl.startsWith("http")) {
    setTimeout(() => {
      triggerApkDownload(source);
    }, 1500);
  }
}

document.getElementById("simulatePhoneScanBtn")?.addEventListener("click", () => {
  startMobileAutoDownloadFlow("mobile_sim");
});

// Detect real mobile user-agent or ?autoDownload=1 from QR scan on page load
const urlParams = new URLSearchParams(window.location.search);
const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
if (urlParams.get("autoDownload") === "1" || isMobileUA) {
  startMobileAutoDownloadFlow(urlParams.get("source") || "qr");
} else {
  setApkPanelMode("desktop");
}

// Connect to Real-Time Server-Sent Events (/api/events)
renderQrCodeForState();
try {
  const evtSource = new EventSource("/api/events");
  evtSource.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data);
      updateStatsUI(payload, payload.type === "stats_update" && Boolean(payload.lastEvent));
    } catch {}
  };
} catch {}

// Save GitHub APK Settings Form
const saveApkConfigBtn = document.getElementById("saveApkConfigBtn");
const githubApkUrlInput = document.getElementById("githubApkUrlInput");
const apkVersionInput = document.getElementById("apkVersionInput");
const apkSizeInput = document.getElementById("apkSizeInput");
const apkConfigFeedback = document.getElementById("apkConfigFeedback");

saveApkConfigBtn?.addEventListener("click", async () => {
  const payload = {
    githubApkUrl: githubApkUrlInput?.value.trim() || "",
    apkVersion: apkVersionInput?.value.trim() || "v1.0.4",
    apkSizeMb: apkSizeInput?.value.trim() || "28.4 MB"
  };
  try {
    const res = await fetch("/api/config-apk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const out = await res.json();
      updateStatsUI(out.db, false);
      if (apkConfigFeedback) {
        apkConfigFeedback.style.display = "block";
        apkConfigFeedback.textContent = "Saved! Desktop QR code and mobile downloader now use your updated settings.";
      }
      setTimeout(() => apkConfigModal?.close(), 900);
    }
  } catch {
    updateStatsUI(payload, false);
    apkConfigModal?.close();
  }
});

// ---------------------------------------------------------------------------
// 6. THREE.JS 3D WEBGL HERO WORLD + INTERACTIVE 3D PHONE PHYSICS TILT
// ---------------------------------------------------------------------------
const heroCanvas = document.getElementById("heroWebglCanvas");
const hero3dStage = document.getElementById("hero3dStage");
const legacyPhone3dRig = document.getElementById("phone3dRig");
const floatCard1 = document.getElementById("floatCard1");
const floatCard2 = document.getElementById("floatCard2");
const floatCard3 = document.getElementById("floatCard3");

if (heroCanvas && hero3dStage) {
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9.5);

  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const pointLight1 = new THREE.PointLight(0x2563eb, 8, 25);
  pointLight1.position.set(4, 4, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x60a5fa, 5, 25);
  pointLight2.position.set(-4, -3, 4);
  scene.add(pointLight2);

  const group = new THREE.Group();
  scene.add(group);

  // Outer 3D Alarm Ring Torus
  const torusGeo = new THREE.TorusGeometry(3.2, 0.06, 24, 96);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.25,
    metalness: 0.7
  });
  const torusRing = new THREE.Mesh(torusGeo, torusMat);
  torusRing.rotation.x = 0.45;
  torusRing.rotation.y = -0.3;
  group.add(torusRing);

  // Secondary Dashed/Tilted Orbital Ring
  const torusGeo2 = new THREE.TorusGeometry(3.85, 0.035, 16, 80);
  const torusMat2 = new THREE.MeshStandardMaterial({
    color: 0x60a5fa,
    roughness: 0.3,
    metalness: 0.6
  });
  const torusRing2 = new THREE.Mesh(torusGeo2, torusMat2);
  torusRing2.rotation.x = -0.6;
  torusRing2.rotation.y = 0.5;
  group.add(torusRing2);

  // Floating 3D Geometric Nodes around the phone
  const nodeGeo = new THREE.OctahedronGeometry(0.28, 0);
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2, metalness: 0.8 });
  const nodes = [];
  const nodeOffsets = [
    [-3.4, 2.1, -0.5],
    [3.5, 1.8, 0.4],
    [-3.2, -2.2, 0.6],
    [3.3, -2.0, -0.4]
  ];
  nodeOffsets.forEach(([x, y, z], idx) => {
    const mesh = new THREE.Mesh(nodeGeo, nodeMat);
    mesh.position.set(x, y, z);
    group.add(mesh);
    nodes.push({ mesh, baseY: y, phase: idx * 1.4 });
  });

  function resizeHeroCanvas() {
    const rect = hero3dStage.getBoundingClientRect();
    const w = Math.max(300, rect.width);
    const h = Math.max(400, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resizeHeroCanvas();
  window.addEventListener("resize", resizeHeroCanvas);

  let targetRotX = 0;
  let targetRotY = 0;
  let curRotX = 0;
  let curRotY = 0;

  hero3dStage.addEventListener("pointermove", (e) => {
    const rect = hero3dStage.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    targetRotY = nx * 14;
    targetRotX = -ny * 10;
  });

  hero3dStage.addEventListener("pointerleave", () => {
    targetRotX = 0;
    targetRotY = 0;
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let clockStart = performance.now();

  function animateHero3d(now) {
    const t = (now - clockStart) * 0.001;
    curRotX += (targetRotX - curRotX) * 0.08;
    curRotY += (targetRotY - curRotY) * 0.08;

    // Phone chassis handles local tilt/float; phoneRig handles scroll trajectory without transform collisions
    if (phoneChassis3d && !reduceMotion && !isSpinning) {
      const floatY = Math.sin(t * 1.8) * 3;
      phoneChassis3d.style.transform = `rotateY(${curRotY.toFixed(2)}deg) rotateX(${curRotX.toFixed(2)}deg) translateY(${floatY.toFixed(1)}px)`;
    }
    if (floatCard1 && !reduceMotion) {
      floatCard1.style.transform = `translateZ(48px) translate(${(curRotY * 0.6).toFixed(1)}px, ${(Math.sin(t * 2.1) * 5).toFixed(1)}px)`;
    }
    if (floatCard2 && !reduceMotion) {
      floatCard2.style.transform = `translateZ(64px) translate(${(curRotY * -0.7).toFixed(1)}px, ${(Math.cos(t * 1.9) * 6).toFixed(1)}px)`;
    }
    if (floatCard3 && !reduceMotion) {
      floatCard3.style.transform = `translateZ(56px) translate(${(curRotY * 0.5).toFixed(1)}px, ${(Math.sin(t * 2.4 + 1) * 5).toFixed(1)}px)`;
    }

    torusRing.rotation.z = t * 0.25;
    torusRing2.rotation.z = -t * 0.18;
    group.rotation.y = (curRotY * Math.PI) / 180;
    group.rotation.x = (curRotX * Math.PI) / 180;

    nodes.forEach((n) => {
      n.mesh.rotation.x = t * 0.9 + n.phase;
      n.mesh.rotation.y = t * 1.1 + n.phase;
      n.mesh.position.y = n.baseY + Math.sin(t * 2 + n.phase) * 0.22;
    });

    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(animateHero3d);
  }
  requestAnimationFrame(animateHero3d);
}

// ===========================================================================
// QUADRIX THREEUI 3D PHONE MOTION & UI SCREEN CAROUSEL (ThreeUI Quadrix Style)
// ===========================================================================
const phoneChassis3d = document.getElementById("phoneChassis3d");
const heroPhoneScreenImg = document.getElementById("heroPhoneScreenImg");
const screenPillBtns = Array.from(document.querySelectorAll(".screen-pill-btn"));

const phoneFeatureScreens = [
  { screen: "./assets/screens/missions.png", label: "11 Wake Up Missions" },
  { screen: "./assets/screens/item_scan.png", label: "Live AI Camera Mouse Scan" },
  { screen: "./assets/screens/ring_quote.png", label: "Motivational Ring & Bible Verse" },
  { screen: "./assets/screens/alarms.png", label: "Alarms & Hands-Free AI Voice" },
  { screen: "./assets/screens/study_timer.png", label: "Study & Pomodoro Timer" },
  { screen: "./assets/screens/squad.png", label: "Study Squad Sync Alarms" },
  { screen: "./assets/screens/watch_ad_rewards.png", label: "Rewards & Points Hub (+2 Pts)" },
  { screen: "./assets/screens/world_clock.png", label: "World Clock & Timezones" }
];

let currentScreenIndex = 0;
let isSpinning = false;
let autoSpinTimer = null;

function spinToScreen(targetIndex) {
  if (isSpinning) return;
  isSpinning = true;
  currentScreenIndex = targetIndex;

  const nextItem = phoneFeatureScreens[currentScreenIndex];

  // Update active pill button if present
  screenPillBtns.forEach((btn, idx) => {
    btn.classList.toggle("is-active", idx === currentScreenIndex);
  });

  if (!phoneChassis3d || !heroPhoneScreenImg) {
    isSpinning = false;
    return;
  }

  // 1. Smooth 3D Quadrix spin around Y axis with subtle 3D tilt
  phoneChassis3d.style.transition = "transform 0.85s cubic-bezier(0.34, 1.25, 0.64, 1)";
  phoneChassis3d.style.transform = "rotateY(360deg) rotateX(4deg) scale(0.98)";

  // 2. Exactly halfway (420ms) when back face is facing the camera, seamlessly swap the screen image
  setTimeout(() => {
    if (nextItem && heroPhoneScreenImg) {
      heroPhoneScreenImg.src = nextItem.screen;
    }
    const phoneTapHint = document.getElementById("phoneTapHint");
    if (phoneTapHint && nextItem) {
      const hintSpan = phoneTapHint.querySelector("span");
      if (hintSpan) hintSpan.textContent = nextItem.label;
    }
  }, 420);

  // 3. When rotation completes (860ms), seamlessly reset rotation without visual hitch
  setTimeout(() => {
    phoneChassis3d.style.transition = "none";
    phoneChassis3d.style.transform = "rotateY(0deg) rotateX(4deg) scale(1)";
    isSpinning = false;
  }, 860);
}

function nextPhoneScreen() {
  const nextIdx = (currentScreenIndex + 1) % phoneFeatureScreens.length;
  spinToScreen(nextIdx);
}

function startAutoSpin() {
  stopAutoSpin();
  // Auto-spin disabled: keeps the 3D phone screen firmly locked to 11 Wake Up Missions UI
  // User can still tap/click to rotate through screens manually if desired
}

function stopAutoSpin() {
  if (autoSpinTimer) {
    clearInterval(autoSpinTimer);
    autoSpinTimer = null;
  }
}

// Attach click listeners to pill buttons if present
screenPillBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    stopAutoSpin();
    spinToScreen(idx);
    startAutoSpin();
  });
});

// Interactive 3D Phone Tap & Parallax Response
const phone3dRig = document.getElementById("phone3dRig");
const phoneTapHint = document.getElementById("phoneTapHint");

function handlePhoneTapAction() {
  stopAutoSpin();
  nextPhoneScreen();
  startAutoSpin();
}

if (phone3dRig) {
  // Tap or click phone to spin and switch feature screen
  phone3dRig.addEventListener("click", handlePhoneTapAction);
  phone3dRig.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePhoneTapAction();
    }
  });

  // Pause auto spin on hover so user can inspect screen, resume on mouse leave
  phone3dRig.addEventListener("mouseenter", () => stopAutoSpin());
  phone3dRig.addEventListener("mouseleave", () => startAutoSpin());

  // Interactive 3D parallax tilt response
  phone3dRig.addEventListener("pointermove", (e) => {
    if (isSpinning) return;
    const rect = phone3dRig.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltX = -y * 12;
    const tiltY = x * 15;
    if (phoneChassis3d) {
      phoneChassis3d.style.transition = "transform 0.15s ease-out";
      phoneChassis3d.style.transform = `rotateY(${tiltY}deg) rotateX(${tiltX}deg)`;
    }
  });

  phone3dRig.addEventListener("pointerleave", () => {
    if (isSpinning) return;
    if (phoneChassis3d) {
      phoneChassis3d.style.transition = "transform 0.4s ease-out";
      phoneChassis3d.style.transform = "rotateY(0deg) rotateX(4deg)";
    }
  });
}

if (phoneTapHint) {
  phoneTapHint.addEventListener("click", handlePhoneTapAction);
}

// Click on 11 Wake Up Mission cards spins the 3D phone to the matching screen
document.querySelectorAll(".les").forEach((lesEl) => {
  lesEl.addEventListener("click", () => {
    const lesIdx = lesEl.getAttribute("data-les");
    stopAutoSpin();
    if (lesIdx === "0") {
      // Camera Object Scan -> Live AI Camera Mouse Scan screen
      spinToScreen(1);
    } else {
      // 11 Wake Up Missions routine list
      spinToScreen(0);
    }
  });
});

// Start auto spin on page load
startAutoSpin();

// ===========================================================================
// AURELLO-STYLE FAQ ACCORDION INTERACTION (threeui.com/section-aurello-faq)
// ===========================================================================
document.querySelectorAll(".aurello-faq-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".aurello-faq-item");
    const isOpen = item.classList.contains("is-open");
    const icon = btn.querySelector(".faq-icon");

    if (isOpen) {
      item.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      if (icon) icon.textContent = "+";
    } else {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      if (icon) icon.textContent = "−";
    }
  });
});

// 3D Bento Card Subtle Tilt Physics
document.querySelectorAll('.card-3d[data-tilt="true"]').forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = card.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    card.style.transform = `perspective(1000px) rotateX(${(-ny * 3.5).toFixed(2)}deg) rotateY(${(nx * 3.5).toFixed(2)}deg) translateY(-2px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

// ---------------------------------------------------------------------------
// 7. MANDATORY TAGLINE REVEAL SECTION (landing-page-design B11)
// ---------------------------------------------------------------------------
const taglineRevealHeading = document.getElementById("taglineRevealHeading");
if (taglineRevealHeading) {
  const rawWords = taglineRevealHeading.textContent.trim().split(/\s+/);
  taglineRevealHeading.innerHTML = rawWords
    .map((w) => `<span class="reveal-word">${w}</span>`)
    .join(" ");

  const wordSpans = Array.from(taglineRevealHeading.querySelectorAll(".reveal-word"));
  let taglineRafPending = false;

  function updateTaglineWordsOnScroll() {
    taglineRafPending = false;
    const triggerY = window.innerHeight * 0.76;
    wordSpans.forEach((span) => {
      if (span.classList.contains("is-lit")) return;
      const rect = span.getBoundingClientRect();
      if (rect.top < triggerY) {
        span.classList.add("is-lit");
      }
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!taglineRafPending) {
        taglineRafPending = true;
        requestAnimationFrame(updateTaglineWordsOnScroll);
      }
    },
    { passive: true }
  );
  updateTaglineWordsOnScroll();
}

// ---------------------------------------------------------------------------
// 8. SCROLL REVEALS + SECTION-AWARE MASCOT GUIDE (IntersectionObserver)
// ---------------------------------------------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal-on-scroll").forEach((el) => revealObserver.observe(el));

// Section-Aware Mascot Pose Updates on Scroll
const SECTION_MASCOT_MAP = {
  top: MASCOT_POSES[1],
  features: MASCOT_POSES[2],
  missions: MASCOT_POSES[3],
  "video-demos": MASCOT_POSES[4],
  developer: MASCOT_POSES[0],
  faq: MASCOT_POSES[5]
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && (!currentAudioEl || currentAudioEl.paused)) {
        const id = entry.target.id;
        if (SECTION_MASCOT_MAP[id]) {
          updateMascotState(SECTION_MASCOT_MAP[id], false);
        }
      }
    });
  },
  { threshold: 0.35 }
);

Object.keys(SECTION_MASCOT_MAP).forEach((id) => {
  const sec = document.getElementById(id);
  if (sec) sectionObserver.observe(sec);
});

// ---------------------------------------------------------------------------
// 9. INTERACTIVE FEATURE SIMULATORS (AI Voice, Watch Ads +2 Pts, Pomodoro, 11 Missions)
// ---------------------------------------------------------------------------
const AI_VOICE_SAMPLES = [
  {
    prompt: '"Wake me up at 6:30 AM for Study with Math Challenge!"',
    time: "06:30 AM",
    meta: "Study · Mission: Math Challenge · Enabled"
  },
  {
    prompt: '"Set an alarm for 5:45 AM with Live Laptop Item Scan!"',
    time: "05:45 AM",
    meta: "Early Thesis · Mission: AI Laptop Scan · Enabled"
  },
  {
    prompt: '"Wake up our Squad at 7:00 AM with Typing Test!"',
    time: "07:00 AM",
    meta: "Squad Sync · Mission: Typing Test · Enabled"
  }
];
let aiSampleIdx = 0;

document.getElementById("simAiVoiceBtn")?.addEventListener("click", () => {
  aiSampleIdx = (aiSampleIdx + 1) % AI_VOICE_SAMPLES.length;
  const sample = AI_VOICE_SAMPLES[aiSampleIdx];
  const promptEl = document.getElementById("aiPromptDisplay");
  const timeEl = document.getElementById("aiResultTime");
  const metaEl = document.getElementById("aiResultMeta");
  const statusEl = document.getElementById("aiStatusPill");
  if (promptEl) promptEl.textContent = sample.prompt;
  if (timeEl) timeEl.textContent = sample.time;
  if (metaEl) metaEl.textContent = sample.meta;
  if (statusEl) statusEl.textContent = "AI Created ✓";

  playMascotVoice(
    "./assets/audio/scene_04_ai_assistant_english.mp3",
    "boy_pose_8_mic_ai",
    `AI Voice Assistant heard: ${sample.prompt} — Alarm set for ${sample.time}!`,
    "🎙️"
  );
});

// Watch Ads (+2 Points) Simulator
let simPoints = 46;
document.getElementById("watchAdSimBtn")?.addEventListener("click", () => {
  simPoints = simPoints >= 50 ? 52 : simPoints + 2;
  const valEl = document.getElementById("simPointsValue");
  const progEl = document.getElementById("simPointsProgress");
  const statusEl = document.getElementById("simPointsStatus");
  if (valEl) valEl.textContent = `${simPoints} points (+2 Earned!)`;
  if (progEl) progEl.value = Math.min(50, simPoints);
  if (statusEl) {
    statusEl.textContent =
      simPoints >= 50
        ? "🎉 50 Points Reached! All Premium Study Themes, Smile Scan & Extra Loud Boost Unlocked Free!"
        : `Earned +2 points! Only ${50 - simPoints} points away from unlocking 50 point Premium Features!`;
  }
});

// Pomodoro Focus Timer Simulator
let pomoRunning = false;
let pomoSeconds = 25 * 60;
let pomoInterval = null;
const pomodoroDisplay = document.getElementById("pomodoroDisplay");
const pomodoroBtnLabel = document.getElementById("pomodoroBtnLabel");

document.getElementById("togglePomodoroBtn")?.addEventListener("click", () => {
  pomoRunning = !pomoRunning;
  if (pomodoroBtnLabel) pomodoroBtnLabel.textContent = pomoRunning ? "Pause Focus" : "Resume Focus";
  if (pomoRunning) {
    pomoInterval = setInterval(() => {
      pomoSeconds = Math.max(0, pomoSeconds - 1);
      const m = String(Math.floor(pomoSeconds / 60)).padStart(2, "0");
      const s = String(pomoSeconds % 60).padStart(2, "0");
      if (pomodoroDisplay) pomodoroDisplay.textContent = `${m}:${s}`;
    }, 1000);
  } else if (pomoInterval) {
    clearInterval(pomoInterval);
  }
});

// 11 Wake-Up Missions Explorer Data
const MISSION_DETAILS = {
  item_scan: {
    badge: "LIVE AI CAMERA VERIFICATION",
    title: "1. AI Reminder Item Scan (Computer Mouse / Desk Item)",
    desc: "Point your camera at your real computer mouse or study item inside the framing square. AlarmMates verifies 5 consecutive AI detections on live camera without saving any photos.",
    screen: "./assets/screens/item_scan.png",
    sticker: "./assets/stickers/boy_pose_3_tech_open.png"
  },
  math: {
    badge: "COGNITIVE ARITHMETIC MISSION",
    title: "2. Math Challenge",
    desc: "Solve multi step arithmetic equations under time pressure before the alarm stops ringing.",
    screen: "./assets/screens/missions.png",
    sticker: "./assets/stickers/boy_pose_7_pointing_open.png"
  },
  typing: {
    badge: "MOTIVATIONAL TYPING MISSION",
    title: "3. Typing Test",
    desc: "Type out an inspiring morning quote or study affirmation with 100% accuracy to silence the ring.",
    screen: "./assets/screens/missions.png",
    sticker: "./assets/stickers/boy_pose_1_present_open.png"
  },
  shake: {
    badge: "PHYSICAL MOTION SENSOR",
    title: "4. Shake Phone Mission",
    desc: "Physically shake your phone vigorously until the accelerometer meter reaches 100%.",
    screen: "./assets/screens/watch_ad_rewards.png",
    sticker: "./assets/stickers/boy_pose_4_alarm_open.png"
  },
  smile: {
    badge: "FACIAL EXPRESSION AI",
    title: "5. Smile Scan",
    desc: "Start your morning with positive energy by holding a genuine smile in front of the front camera.",
    screen: "./assets/screens/watch_ad_rewards.png",
    sticker: "./assets/stickers/boy_pose_5_thumbsup_open.png"
  },
  steps: {
    badge: "PEDOMETER WAKE UP",
    title: "6. Step Counter",
    desc: "Stand up out of bed and walk the target number of steps so you never fall back asleep.",
    screen: "./assets/screens/routines.png",
    sticker: "./assets/stickers/boy_pose_6_wave_dev_open.png"
  },
  qr: {
    badge: "LOCATION VERIFICATION",
    title: "7. QR / Barcode Scan",
    desc: "Place a QR code or barcode in your bathroom or kitchen desk and scan it to prove you left your bed.",
    screen: "./assets/screens/missions.png",
    sticker: "./assets/stickers/boy_pose_7_pointing_open.png"
  },
  memory: {
    badge: "VISUAL RECALL GRID",
    title: "8. Memory Match",
    desc: "Memorize the lit color tiles on the board and tap the exact pattern back in sequence.",
    screen: "./assets/screens/watch_ad_rewards.png",
    sticker: "./assets/stickers/boy_pose_2_shocked_open.png"
  },
  puzzle: {
    badge: "SPATIAL LOGIC MISSION",
    title: "9. Sliding Puzzle",
    desc: "Slide the numbered tiles into ascending order to wake up your problem solving cortex.",
    screen: "./assets/screens/watch_ad_rewards.png",
    sticker: "./assets/stickers/boy_pose_3_tech_open.png"
  },
  crossword: {
    badge: "VOCABULARY CHALLENGE",
    title: "10. Mini Crossword",
    desc: "Complete a compact morning word puzzle to engage language recall right as you wake up.",
    screen: "./assets/screens/watch_ad_rewards.png",
    sticker: "./assets/stickers/boy_pose_1_present_open.png"
  },
  verse: {
    badge: "MORNING REFLECTION",
    title: "11. Daily Bible Verse & Motivational Ring",
    desc: "Wake up to uplifting scripture (Psalm 34:17) and calming ocean visuals before starting your mission.",
    screen: "./assets/screens/ring_quote.png",
    sticker: "./assets/stickers/boy_pose_5_thumbsup_open.png"
  }
};

document.querySelectorAll("#missionsChipGrid .mission-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("#missionsChipGrid .mission-chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const key = chip.getAttribute("data-mission") || "item_scan";
    const info = MISSION_DETAILS[key] || MISSION_DETAILS.item_scan;

    const badgeEl = document.getElementById("missionDetailBadge");
    const titleEl = document.getElementById("missionDetailTitle");
    const descEl = document.getElementById("missionDetailDesc");
    const imgEl = document.getElementById("missionPreviewImg");
    const stickerEl = document.getElementById("missionDetailSticker");

    if (badgeEl) badgeEl.textContent = info.badge;
    if (titleEl) titleEl.textContent = info.title;
    if (descEl) descEl.textContent = info.desc;
    if (imgEl) imgEl.src = info.screen;
    if (stickerEl) stickerEl.src = info.sticker;
  });
});

// ---------------------------------------------------------------------------
// 10. INTERACTIVE VIDEO DEMO THEATER (English, Taglish COMMERCIAL & ADS)
// ---------------------------------------------------------------------------
const demoVideoPlayer = document.getElementById("demoVideoPlayer");

document.querySelectorAll(".video-toolbar .apk-mode-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".video-toolbar .apk-mode-tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    const src = tab.getAttribute("data-video");
    const mode = tab.getAttribute("data-mode");
    if (demoVideoPlayer && src) {
      if (mode === "promo_en") {
        demoVideoPlayer.setAttribute("poster", "./assets/videos/intro_poster.jpg");
      } else {
        demoVideoPlayer.removeAttribute("poster");
      }
      demoVideoPlayer.src = src;
      demoVideoPlayer.load();
      demoVideoPlayer.play().catch(() => {});
    }
  });
});

// Kage 3D WebGL engine, grain & transitions are powered by /kage-engine.js


// ===========================================================================
// 11. THREEUI KAIRO-STYLE 3D PHONE & AM LOGO SCROLL SWAP & DESCENT CONTROLLER
// ===========================================================================
function initScrollSwapMotion() {
  const phoneRig = document.getElementById("phone3dRig");
  const logoRig = document.getElementById("logo3dRig");
  const phoneCol = document.querySelector(".hero-phone-col");
  const logoCol = document.querySelector(".hero-logo-col");
  const tapHint = document.getElementById("phoneTapHint");
  if (!phoneRig || !logoRig) return;

  let currentScrollY = window.scrollY || window.pageYOffset || 0;
  let targetScrollY = currentScrollY;
  let lastScrollY = currentScrollY;
  let swapDistance = 0;
  let initialPhoneTop = 271;
  let initialPhoneLeft = 1139;
  let initialLogoTop = 328;
  let initialLogoLeft = 107;

  function measureGeometry() {
    const pTrans = phoneRig.style.transform;
    const lTrans = logoRig.style.transform;
    phoneRig.style.transform = "none";
    logoRig.style.transform = "none";

    const sy = window.scrollY || window.pageYOffset || 0;
    const rPhone = phoneCol ? phoneCol.getBoundingClientRect() : phoneRig.getBoundingClientRect();
    const rLogo = logoCol ? logoCol.getBoundingClientRect() : logoRig.getBoundingClientRect();

    initialPhoneTop = rPhone.top + sy;
    initialPhoneLeft = rPhone.left;
    initialLogoTop = rLogo.top + sy;
    initialLogoLeft = rLogo.left;

    if (window.innerWidth >= 768) {
      swapDistance = Math.abs((rPhone.left + rPhone.width / 2) - (rLogo.left + rLogo.width / 2));
    } else {
      swapDistance = 0;
    }

    phoneRig.style.transform = pTrans;
    logoRig.style.transform = lTrans;
  }

  measureGeometry();
  window.addEventListener("resize", measureGeometry, { passive: true });

  const SWAP_RANGE = 600; // Scroll range to complete 100% position swap
  const LERP_FACTOR = 0.35; // Fast, snappy, instantaneous tracking (Kairo reference speed)

  // -------------------------------------------------------------------------
  // ARCHITECTED SECTION OPEN-SPACE FLIGHT ENGINE (Zero Overlap & Zero Corner-Hiding)
  // Dynamically computes the true open space for each section so the 3D phone
  // proudly frames content rather than hiding on the edge or covering text.
  // Weaves: Right (Hero) ➔ Left (Superpowers) ➔ Right (11 Missions) ➔ Left (Video) ➔ Right (Dev) ➔ Left (Download)
  // -------------------------------------------------------------------------
  function computeSectionTarget(secName, vpW, vpH) {
    const isDesktop = vpW >= 768;
    const baseW = 194;

    if (!isDesktop) {
      const mobScale = 0.38;
      const mobW = 180 * mobScale; // ~68px
      const leftX = 14;
      const rightX = Math.max(14, vpW - 14 - mobW);
      switch (secName) {
        case "hero": return { visualLeft: rightX, scale: mobScale, side: "right" };
        case "superpowers": return { visualLeft: leftX, scale: mobScale, side: "left" };
        case "missions": return { visualLeft: rightX, scale: mobScale, side: "right" };
        case "videoTheater": return { visualLeft: leftX, scale: mobScale, side: "left" };
        case "developer": return { visualLeft: rightX, scale: mobScale, side: "right" };
        case "download": return { visualLeft: leftX, scale: mobScale, side: "left" };
        default: return { visualLeft: rightX, scale: mobScale, side: "right" };
      }
    }

    // Desktop Viewports (768px - 1920px+)
    switch (secName) {
      case "hero": {
        return { visualLeft: initialPhoneLeft, scale: 1.0, side: "right" };
      }
      case "superpowers": {
        // .bento-grid is centered with max-width: 1200px
        const gutter = Math.max(0, (vpW - 1200) / 2);
        const targetScale = gutter >= 200 ? 0.78 : Math.min(0.78, Math.max(0.50, (gutter - 18) / baseW));
        const scaledW = baseW * targetScale;
        const visualLeft = Math.max(24, (gutter - scaledW) / 2);
        return { visualLeft, scale: targetScale, side: "left" };
      }
      case "missions": {
        // .cur 11 missions list is centered with max-width: 820px
        const curRight = vpW / 2 + 410;
        const gutter = Math.max(0, vpW - curRight);
        const targetScale = gutter >= 220 ? 0.82 : Math.min(0.82, Math.max(0.52, (gutter - 24) / baseW));
        const scaledW = baseW * targetScale;
        // Positioned cleanly inside the right open space with breathing margins on both sides
        const visualLeft = Math.min(vpW - scaledW - 32, curRight + (gutter - scaledW) / 2);
        return { visualLeft, scale: targetScale, side: "right" };
      }
      case "videoTheater": {
        // .video-theater-card is centered with max-width: 780px
        const vidLeft = vpW / 2 - 390;
        const gutter = Math.max(0, vidLeft);
        const targetScale = gutter >= 200 ? 0.76 : Math.min(0.76, Math.max(0.50, (gutter - 18) / baseW));
        const scaledW = baseW * targetScale;
        // Centered inside the left open space framing the video demo player cleanly
        const visualLeft = Math.max(28, (gutter - scaledW) / 2);
        return { visualLeft, scale: targetScale, side: "left" };
      }
      case "developer": {
        // .bento-grid in developer studio is centered with max-width: 1200px
        const devRight = vpW / 2 + 600;
        const gutter = Math.max(0, vpW - devRight);
        const targetScale = gutter >= 200 ? 0.78 : Math.min(0.78, Math.max(0.50, (gutter - 18) / baseW));
        const scaledW = baseW * targetScale;
        const visualLeft = Math.min(vpW - scaledW - 28, devRight + (gutter - scaledW) / 2);
        return { visualLeft, scale: targetScale, side: "right" };
      }
      case "download": {
        // .split-cta-faq-grid is centered with max-width: 1200px
        const gutter = Math.max(0, (vpW - 1200) / 2);
        const targetScale = gutter >= 200 ? 0.76 : Math.min(0.76, Math.max(0.50, (gutter - 18) / baseW));
        const scaledW = baseW * targetScale;
        const visualLeft = Math.max(28, (gutter - scaledW) / 2);
        return { visualLeft, scale: targetScale, side: "left" };
      }
      default: {
        return { visualLeft: initialPhoneLeft, scale: 1.0, side: "right" };
      }
    }
  }

  function getDynamicWaypoints() {
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    const isDesktop = vpW >= 768;

    const gate = document.getElementById("gate");
    const pathways = document.getElementById("pathways");
    const lessons = document.getElementById("lessons");
    const developer = document.getElementById("developer");
    const download = document.getElementById("download");

    const gateTop = gate ? gate.offsetTop : 920;
    const pathTop = pathways ? pathways.offsetTop : 1992;
    const lessTop = lessons ? lessons.offsetTop : 3041;
    const devTop = developer ? developer.offsetTop : 3980;
    const downTop = download ? download.offsetTop : 4737;

    const heroTarg = computeSectionTarget("hero", vpW, vpH);
    const spTarg   = computeSectionTarget("superpowers", vpW, vpH);
    const misTarg  = computeSectionTarget("missions", vpW, vpH);
    const vidTarg  = computeSectionTarget("videoTheater", vpW, vpH);
    const devTarg  = computeSectionTarget("developer", vpW, vpH);
    const downTarg = computeSectionTarget("download", vpW, vpH);

    return [
      { scroll: 0,                              visualLeft: heroTarg.visualLeft, scale: heroTarg.scale },
      { scroll: Math.max(160, gateTop - 500),   visualLeft: heroTarg.visualLeft, scale: heroTarg.scale },
      { scroll: gateTop - 100,                  visualLeft: spTarg.visualLeft,   scale: spTarg.scale },
      { scroll: pathTop - 500,                  visualLeft: spTarg.visualLeft,   scale: spTarg.scale },
      { scroll: pathTop - 80,                   visualLeft: misTarg.visualLeft,  scale: misTarg.scale },
      { scroll: lessTop - 500,                  visualLeft: misTarg.visualLeft,  scale: misTarg.scale },
      { scroll: lessTop - 80,                   visualLeft: vidTarg.visualLeft,  scale: vidTarg.scale },
      { scroll: devTop - 500,                   visualLeft: vidTarg.visualLeft,  scale: vidTarg.scale },
      { scroll: devTop - 80,                    visualLeft: devTarg.visualLeft,  scale: devTarg.scale },
      { scroll: downTop - 550,                  visualLeft: devTarg.visualLeft,  scale: devTarg.scale },
      { scroll: downTop - 100,                  visualLeft: downTarg.visualLeft, scale: downTarg.scale },
      { scroll: downTop + 1500,                 visualLeft: downTarg.visualLeft, scale: downTarg.scale }
    ];
  }

  function computeTrajectory(sy) {
    const waypoints = getDynamicWaypoints();
    if (sy <= waypoints[0].scroll) {
      return { visualLeft: waypoints[0].visualLeft, scale: waypoints[0].scale, transitionArc: 0, direction: 0 };
    }
    const last = waypoints[waypoints.length - 1];
    if (sy >= last.scroll) {
      return { visualLeft: last.visualLeft, scale: last.scale, transitionArc: 0, direction: 0 };
    }

    for (let i = 0; i < waypoints.length - 1; i++) {
      const w0 = waypoints[i];
      const w1 = waypoints[i + 1];
      if (sy >= w0.scroll && sy <= w1.scroll) {
        const span = w1.scroll - w0.scroll;
        const t = span > 0 ? (sy - w0.scroll) / span : 0;
        const ease = 0.5 * (1 - Math.cos(t * Math.PI));
        const arc = Math.sin(t * Math.PI);
        const dir = Math.sign(w1.visualLeft - w0.visualLeft);
        const vLeft = w0.visualLeft + ease * (w1.visualLeft - w0.visualLeft);
        const sc = w0.scale + ease * (w1.scale - w0.scale);
        return { visualLeft: vLeft, scale: sc, transitionArc: arc, direction: dir };
      }
    }
    return { visualLeft: last.visualLeft, scale: last.scale, transitionArc: 0, direction: 0 };
  }

  function renderSwap() {
    targetScrollY = window.scrollY || window.pageYOffset || 0;
    const prevScrollY = currentScrollY;
    currentScrollY += (targetScrollY - currentScrollY) * LERP_FACTOR;
    if (Math.abs(targetScrollY - currentScrollY) < 0.15) currentScrollY = targetScrollY;

    const scrollVelocity = (currentScrollY - prevScrollY);
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    const isDesktop = vpW >= 768;

    const traj = computeTrajectory(currentScrollY);

    if (isDesktop) {
      // ---------------------------------------------------------------------
      // DESKTOP: Smooth Continuous Flight into Section Open Spaces
      // ---------------------------------------------------------------------
      const targetScale = traj.scale;
      const dockedScreenY = Math.max(120, Math.min(220, (vpH - 418 * targetScale) * 0.38));
      const heroScreenY = initialPhoneTop;
      const targetPhoneY = targetScrollY + (dockedScreenY - heroScreenY);
      const easeY = Math.min(1, currentScrollY / 380);
      const phoneY = easeY * targetPhoneY;

      // X translation is exactly: visual target left minus initial starting left
      const phoneX = traj.visualLeft - initialPhoneLeft;

      // Dynamic aerodynamic 3D banking and yaw
      const bankingAngle = traj.direction * traj.transitionArc * 8.5;
      const turnYaw = traj.direction * traj.transitionArc * 13.0;
      const velocityTilt = Math.max(-7, Math.min(7, scrollVelocity * 0.10));

      const phoneRotZ = bankingAngle - velocityTilt * 0.35;
      const phoneRotY = turnYaw;
      const phoneRotX = 4 + traj.transitionArc * 2 + velocityTilt * 0.5;

      phoneRig.style.transform = `translate3d(${phoneX.toFixed(2)}px, ${phoneY.toFixed(2)}px, 0) rotateZ(${phoneRotZ.toFixed(2)}deg) rotateY(${phoneRotY.toFixed(2)}deg) rotateX(${phoneRotX.toFixed(2)}deg) scale(${targetScale.toFixed(3)})`;
      phoneRig.style.opacity = "1.0";
      phoneRig.style.pointerEvents = "auto";

      // 3D AM Logo: swaps in Hero and fades out completely before entering Superpowers (scrollY 460)
      const heroExitP = Math.min(1, Math.max(0, currentScrollY / 420));
      if (currentScrollY > 480) {
        logoRig.style.opacity = "0";
        logoRig.style.pointerEvents = "none";
        logoRig.style.visibility = "hidden";
      } else {
        const logoEase = 0.5 * (1 - Math.cos(heroExitP * Math.PI));
        const logoArc = Math.sin(heroExitP * Math.PI);
        const logoTargetY = currentScrollY + (dockedScreenY - initialLogoTop);
        const logoY = easeY * logoTargetY;
        const logoX = logoEase * swapDistance;
        const logoRotZ = logoArc * 7.5;
        const logoRotY = logoArc * 12;
        const logoScale = 1.0 + logoArc * 0.04;
        const logoOpacity = Math.max(0, 1 - currentScrollY / 420);

        logoRig.style.visibility = "visible";
        logoRig.style.transform = `translate3d(${logoX.toFixed(2)}px, ${logoY.toFixed(2)}px, 0) rotateZ(${logoRotZ.toFixed(2)}deg) rotateY(${logoRotY.toFixed(2)}deg) scale(${logoScale.toFixed(3)})`;
        logoRig.style.opacity = logoOpacity.toFixed(3);
        logoRig.style.pointerEvents = logoOpacity < 0.05 ? "none" : "auto";
      }

      if (tapHint) {
        tapHint.style.opacity = Math.max(0, 1 - heroExitP * 2.2).toFixed(2);
      }
    } else {
      // ---------------------------------------------------------------------
      // MOBILE: Compact 0.38x Phone Weaving Across Side Gutters
      // ---------------------------------------------------------------------
      const mobScale = traj.scale;
      const MOB_RANGE = 260;
      const mobP = Math.min(1, Math.max(0, (currentScrollY - 50) / MOB_RANGE));
      const mobEase = 0.5 * (1 - Math.cos(mobP * Math.PI));

      const phoneWidth = 180;
      const phoneHeight = 388;
      const scaleShiftX = (phoneWidth * (1 - mobScale)) / 2;
      const scaleShiftY = (phoneHeight * (1 - mobScale)) / 2;

      // X translation relative to initial position
      const targetVisualLeft = traj.visualLeft - scaleShiftX;
      const phoneX = mobEase * (targetVisualLeft - initialPhoneLeft);

      const targetScreenY = Math.max(130, Math.min(280, vpH * 0.34)) - scaleShiftY;
      const heroScreenY = initialPhoneTop;
      const targetPhoneY = targetScrollY + (targetScreenY - heroScreenY);
      const phoneY = mobEase * targetPhoneY;

      const bankingAngle = traj.direction * traj.transitionArc * -6.5;
      const velocityTilt = Math.max(-5, Math.min(5, scrollVelocity * 0.08));
      const phoneRotZ = bankingAngle - velocityTilt * 0.35;
      const phoneRotY = traj.direction * traj.transitionArc * -9.0;
      const phoneRotX = 4 + velocityTilt * 0.45;

      phoneRig.style.transform = `translate3d(${phoneX.toFixed(2)}px, ${phoneY.toFixed(2)}px, 0) rotateZ(${phoneRotZ.toFixed(2)}deg) rotateY(${phoneRotY.toFixed(2)}deg) rotateX(${phoneRotX.toFixed(2)}deg) scale(${mobScale.toFixed(3)})`;
      phoneRig.style.opacity = "1.0";
      phoneRig.style.pointerEvents = "auto";

      const mobLogoOpacity = Math.max(0, 1 - currentScrollY / 280);
      logoRig.style.transform = `translate3d(0, 0, 0)`;
      logoRig.style.opacity = mobLogoOpacity.toFixed(3);
      logoRig.style.pointerEvents = mobLogoOpacity < 0.05 ? "none" : "auto";

      if (tapHint) {
        tapHint.style.opacity = Math.max(0, 1 - mobP * 2).toFixed(2);
      }
    }

    requestAnimationFrame(renderSwap);
  }

  requestAnimationFrame(renderSwap);
}

// Start scroll swap motion after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollSwapMotion);
} else {
  initScrollSwapMotion();
}
