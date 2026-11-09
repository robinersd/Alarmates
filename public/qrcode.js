/* ==========================================================================
   Pure Client-Side ISO/IEC 18004 QR Code SVG Generator (Byte Mode, EC Level L)
   Supports Versions 1..10 (up to 271 bytes — covers any LAN or GitHub APK URL)
   ========================================================================== */

(function (global) {
  // Capacities (Total Codewords, EC Codewords per block, Num Blocks) for EC Level L, Versions 1..10
  const VERSION_TABLE = [
    null,
    { total: 26, ec: 7, blocks: 1 },   // v1 (21x21) - up to 17 bytes
    { total: 44, ec: 10, blocks: 1 },  // v2 (25x25) - up to 32 bytes
    { total: 70, ec: 15, blocks: 1 },  // v3 (29x29) - up to 53 bytes
    { total: 100, ec: 20, blocks: 1 }, // v4 (33x33) - up to 78 bytes
    { total: 134, ec: 26, blocks: 1 }, // v5 (37x37) - up to 106 bytes
    { total: 172, ec: 18, blocks: 2 }, // v6 (41x41) - up to 134 bytes
    { total: 196, ec: 20, blocks: 2 }, // v7 (45x45) - up to 154 bytes
    { total: 242, ec: 24, blocks: 2 }, // v8 (49x49) - up to 192 bytes
    { total: 292, ec: 30, blocks: 2 }, // v9 (53x53) - up to 230 bytes
    { total: 346, ec: 18, blocks: 4 }  // v10 (57x57) - up to 271 bytes
  ];

  const ALIGNMENT_POS = [
    null,
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50]
  ];

  // GF(256) tables
  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return EXP[LOG[a] + LOG[b]];
  }

  function polyMul(p, q) {
    const out = new Uint8Array(p.length + q.length - 1);
    for (let i = 0; i < p.length; i++) {
      for (let j = 0; j < q.length; j++) {
        out[i + j] ^= gfMul(p[i], q[j]);
      }
    }
    return out;
  }

  function rsGeneratorPoly(degree) {
    let g = new Uint8Array([1]);
    for (let i = 0; i < degree; i++) {
      g = polyMul(g, new Uint8Array([1, EXP[i]]));
    }
    return g;
  }

  function rsEncode(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const msg = new Uint8Array(data.length + ecLen);
    msg.set(data, 0);
    for (let i = 0; i < data.length; i++) {
      const coef = msg[i];
      if (coef !== 0) {
        for (let j = 0; j < gen.length; j++) {
          msg[i + j] ^= gfMul(gen[j], coef);
        }
      }
    }
    return msg.slice(data.length);
  }

  function pickVersion(byteLen) {
    for (let v = 1; v <= 10; v++) {
      const info = VERSION_TABLE[v];
      const dataCap = info.total - info.ec * info.blocks;
      const headerBits = v <= 9 ? 12 : 20;
      const maxBytes = Math.floor((dataCap * 8 - headerBits) / 8);
      if (byteLen <= maxBytes) return v;
    }
    return 10;
  }

  function encodeDataCodewords(bytes, version) {
    const info = VERSION_TABLE[version];
    const dataCodewordsLen = info.total - info.ec * info.blocks;
    const bits = [];
    function pushBits(val, len) {
      for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    }
    // Byte mode indicator (0100)
    pushBits(0b0100, 4);
    pushBits(bytes.length, version <= 9 ? 8 : 16);
    for (let i = 0; i < bytes.length; i++) pushBits(bytes[i], 8);
    // Terminator
    const maxBits = dataCodewordsLen * 8;
    for (let i = 0; i < 4 && bits.length < maxBits; i++) bits.push(0);
    while (bits.length % 8 !== 0) bits.push(0);

    const codewords = [];
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      codewords.push(b);
    }
    let padToggle = true;
    while (codewords.length < dataCodewordsLen) {
      codewords.push(padToggle ? 0xec : 0x11);
      padToggle = !padToggle;
    }

    // Split into blocks and compute RS error correction
    const numBlocks = info.blocks;
    const blockDataLen = Math.floor(dataCodewordsLen / numBlocks);
    const dataBlocks = [];
    const ecBlocks = [];
    let offset = 0;
    for (let b = 0; b < numBlocks; b++) {
      const d = Uint8Array.from(codewords.slice(offset, offset + blockDataLen));
      offset += blockDataLen;
      dataBlocks.push(d);
      ecBlocks.push(rsEncode(d, info.ec));
    }

    const interleaved = [];
    for (let i = 0; i < blockDataLen; i++) {
      for (let b = 0; b < numBlocks; b++) interleaved.push(dataBlocks[b][i]);
    }
    for (let i = 0; i < info.ec; i++) {
      for (let b = 0; b < numBlocks; b++) interleaved.push(ecBlocks[b][i]);
    }
    return interleaved;
  }

  function buildMatrix(text) {
    const rawBytes = new TextEncoder().encode(text);
    const version = pickVersion(rawBytes.length);
    const size = version * 4 + 17;
    const grid = Array.from({ length: size }, () => new Int8Array(size));
    const isFunc = Array.from({ length: size }, () => new Uint8Array(size));

    function setFuncModule(r, c, dark) {
      if (r < 0 || r >= size || c < 0 || c >= size) return;
      grid[r][c] = dark ? 1 : 0;
      isFunc[r][c] = 1;
    }

    function drawFinder(r0, c0) {
      for (let dr = -1; dr <= 7; dr++) {
        for (let dc = -1; dc <= 7; dc++) {
          const r = r0 + dr;
          const c = c0 + dc;
          const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
          const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
          const inCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
          setFuncModule(r, c, inOuter && (onBorder || inCenter));
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      setFuncModule(6, i, i % 2 === 0);
      setFuncModule(i, 6, i % 2 === 0);
    }

    // Alignment patterns
    const alignCoords = ALIGNMENT_POS[version];
    for (let i = 0; i < alignCoords.length; i++) {
      for (let j = 0; j < alignCoords.length; j++) {
        const ar = alignCoords[i];
        const ac = alignCoords[j];
        if ((ar === 6 && ac === 6) || (ar === 6 && ac === size - 7) || (ar === size - 7 && ac === 6)) {
          continue;
        }
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
            setFuncModule(ar + dr, ac + dc, dark);
          }
        }
      }
    }

    // Reserve format info & dark module
    for (let i = 0; i <= 8; i++) {
      if (i !== 6) {
        setFuncModule(8, i, false);
        setFuncModule(i, 8, false);
      }
    }
    for (let i = 0; i < 8; i++) {
      setFuncModule(8, size - 1 - i, false);
      setFuncModule(size - 1 - i, 8, false);
    }
    setFuncModule(size - 8, 8, true);

    // Place data bits
    const codewords = encodeDataCodewords(rawBytes, version);
    const dataBits = [];
    for (const cw of codewords) {
      for (let i = 7; i >= 0; i--) dataBits.push((cw >>> i) & 1);
    }

    let bitIdx = 0;
    let upward = true;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) {
        const r = upward ? size - 1 - vert : vert;
        for (let j = 0; j < 2; j++) {
          const c = right - j;
          if (!isFunc[r][c]) {
            const bit = bitIdx < dataBits.length ? dataBits[bitIdx++] : 0;
            // Mask pattern 0: (r + c) % 2 === 0
            const masked = ((r + c) % 2 === 0) ? (bit ^ 1) : bit;
            grid[r][c] = masked;
          }
        }
      }
      upward = !upward;
    }

    // Write Format Information for EC Level L (01) + Mask 0 (000) -> 0x77c4
    const fmtBits = 0x77c4;
    function getFmtBit(i) {
      return (fmtBits >>> i) & 1;
    }
    for (let i = 0; i <= 5; i++) setFuncModule(8, i, getFmtBit(14 - i));
    setFuncModule(8, 7, getFmtBit(8));
    setFuncModule(8, 8, getFmtBit(7));
    setFuncModule(7, 8, getFmtBit(6));
    for (let i = 9; i < 15; i++) setFuncModule(14 - i, 8, getFmtBit(14 - i));

    for (let i = 0; i < 8; i++) setFuncModule(8, size - 1 - i, getFmtBit(i));
    for (let i = 8; i < 15; i++) setFuncModule(size - 15 + i, 8, getFmtBit(i));

    return { grid, size };
  }

  function renderQrSvg(text, fgColor = "#0F0D1D", bgColor = "#FFFFFF") {
    const { grid, size } = buildMatrix(text);
    const margin = 2;
    const viewSize = size + margin * 2;
    let paths = "";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c]) {
          paths += `M${c + margin},${r + margin}h1v1h-1z`;
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewSize} ${viewSize}" shape-rendering="crispEdges" role="img" aria-label="QR code to download AlarmMates APK on mobile"><rect width="${viewSize}" height="${viewSize}" fill="${bgColor}"/><path d="${paths}" fill="${fgColor}"/></svg>`;
  }

  global.AlarmMatesQR = { renderQrSvg };
})(window);
