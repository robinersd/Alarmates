import http from "http";
import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "downloads.json");
const SAMPLE_APK_PATH = path.join(PUBLIC_DIR, "download", "AlarmMates-v1.0.4-release.apk");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(path.dirname(SAMPLE_APK_PATH), { recursive: true });

// Ensure a placeholder APK bundle exists until Tristan links the live GitHub Release APK
if (!fs.existsSync(SAMPLE_APK_PATH)) {
  const header = Buffer.from(
    "PK\x03\x04AlarmMates Smart Alarm Clock v1.0.4 APK Bundle — Developed by Tristan (BS Computer Engineering). Replace via GitHub Releases URL in website settings.",
    "utf8"
  );
  fs.writeFileSync(SAMPLE_APK_PATH, header);
}

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

function loadDb() {
  if (fs.existsSync(DB_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch {
      // fall through
    }
  }
  const initial = {
    totalDownloads: 12,
    mobileDownloads: 12,
    desktopDownloads: 0,
    apkVersion: "v1.1",
    apkSizeMb: "80.2 MB",
    githubApkUrl: "https://github.com/robinersd/Alarmates_v1/releases/download/v1.1/AlarMates-1.1-release.apk",
    publicTunnelUrl: "",
    recentEvents: []
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf8");
  return initial;
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

let db = loadDb();
const sseClients = new Set();

async function syncGitHubReleasesCount() {
  try {
    const res = await fetch("https://api.github.com/repos/robinersd/Alarmates_v1/releases", {
      headers: {
        "Accept": "application/vnd.github+json",
        "User-Agent": "AlarmMates-Website-Server"
      }
    });
    if (!res.ok) return;
    const releases = await res.json();
    if (!Array.isArray(releases)) return;
    let ghTotal = 0;
    for (const rel of releases) {
      if (Array.isArray(rel.assets)) {
        for (const asset of rel.assets) {
          if (typeof asset.download_count === "number") {
            ghTotal += asset.download_count;
          }
        }
      }
    }
    if (ghTotal > (db.totalDownloads || 0)) {
      db.totalDownloads = ghTotal;
      saveDb(db);
      broadcastStats();
    }
  } catch {
    // ignore transient network errors
  }
}

function broadcastStats(lastEvent = null) {
  const payload = JSON.stringify({
    type: "stats_update",
    totalDownloads: db.totalDownloads,
    mobileDownloads: db.mobileDownloads,
    desktopDownloads: db.desktopDownloads,
    apkVersion: db.apkVersion,
    apkSizeMb: db.apkSizeMb,
    githubApkUrl: db.githubApkUrl,
    publicTunnelUrl: db.publicTunnelUrl || "",
    recentEvents: db.recentEvents.slice(0, 6),
    lastEvent,
    lanIp: getLanIp(),
    port: PORT
  });
  for (const res of sseClients) {
    try {
      res.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(res);
    }
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".apk": "application/vnd.android.package-archive"
};

function detectDeviceLabel(userAgent = "", source = "web") {
  const ua = userAgent.toLowerCase();
  if (ua.includes("android")) return `Android Phone · ${source === "qr" ? "QR Auto-Download" : "Mobile Auto-Download"}`;
  if (ua.includes("iphone") || ua.includes("ipad")) return `iOS Mobile · ${source === "qr" ? "QR Scan" : "Mobile Visit"}`;
  if (source === "mobile_sim") return "Mobile Simulator · Auto-Download";
  return "Desktop Browser · Direct APK";
}

function recordDownload(req, source = "web") {
  const ua = req.headers["user-agent"] || "";
  const isMobile = /android|iphone|ipad|ipod|mobile/i.test(ua) || source === "qr" || source === "mobile_sim";
  db.totalDownloads += 1;
  if (isMobile) {
    db.mobileDownloads += 1;
  } else {
    db.desktopDownloads += 1;
  }
  const ev = {
    id: "ev-" + Date.now() + "-" + Math.floor(Math.random() * 999),
    device: detectDeviceLabel(ua, source),
    isMobile,
    timestamp: new Date().toISOString()
  };
  db.recentEvents.unshift(ev);
  db.recentEvents = db.recentEvents.slice(0, 12);
  saveDb(db);
  broadcastStats(ev);
  return ev;
}

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(urlObj.pathname);

  // CORS headers for local/LAN testing
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. SSE Real-Time Stream
  if (pathname === "/api/events" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    });
    sseClients.add(res);
    const initPayload = JSON.stringify({
      type: "init",
      totalDownloads: db.totalDownloads,
      mobileDownloads: db.mobileDownloads,
      desktopDownloads: db.desktopDownloads,
      apkVersion: db.apkVersion,
      apkSizeMb: db.apkSizeMb,
      githubApkUrl: db.githubApkUrl,
      publicTunnelUrl: db.publicTunnelUrl || "",
      recentEvents: db.recentEvents.slice(0, 6),
      lanIp: getLanIp(),
      port: PORT
    });
    res.write(`data: ${initPayload}\n\n`);

    req.on("close", () => {
      sseClients.delete(res);
    });
    return;
  }

  // 2. Get current stats & LAN IP
  if (pathname === "/api/stats" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        totalDownloads: db.totalDownloads,
        mobileDownloads: db.mobileDownloads,
        desktopDownloads: db.desktopDownloads,
        apkVersion: db.apkVersion,
        apkSizeMb: db.apkSizeMb,
        githubApkUrl: db.githubApkUrl,
        publicTunnelUrl: db.publicTunnelUrl || "",
        recentEvents: db.recentEvents.slice(0, 6),
        lanIp: getLanIp(),
        port: PORT
      })
    );
    return;
  }

  // 3. Trigger download & increment counter via API (ONLY when official APK is linked!)
  if (pathname === "/api/download-apk") {
    const hasOfficialApk = Boolean(db.githubApkUrl && db.githubApkUrl.startsWith("http"));
    if (!hasOfficialApk) {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          ok: false,
          totalDownloads: 0,
          mobileDownloads: 0,
          desktopDownloads: 0,
          message: "Official APK not uploaded yet"
        })
      );
      return;
    }

    const source = urlObj.searchParams.get("source") || "web";
    const mode = urlObj.searchParams.get("mode") || "file";
    const ev = recordDownload(req, source);

    if (mode === "json") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          ok: true,
          totalDownloads: db.totalDownloads,
          mobileDownloads: db.mobileDownloads,
          desktopDownloads: db.desktopDownloads,
          downloadUrl: db.githubApkUrl,
          event: ev
        })
      );
      return;
    }

    res.writeHead(302, { Location: db.githubApkUrl });
    res.end();
    return;
  }

  // 4. Configure GitHub Release APK URL & version
  if (pathname === "/api/config-apk" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body || "{}");
        if (typeof parsed.githubApkUrl === "string") {
          db.githubApkUrl = parsed.githubApkUrl.trim();
        }
        if (typeof parsed.apkVersion === "string" && parsed.apkVersion.trim()) {
          db.apkVersion = parsed.apkVersion.trim();
        }
        if (typeof parsed.apkSizeMb === "string" && parsed.apkSizeMb.trim()) {
          db.apkSizeMb = parsed.apkSizeMb.trim();
        }
        saveDb(db);
        broadcastStats();
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: true, db }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: false, error: String(err) }));
      }
    });
    return;
  }

  // 5. QR Scan Short Route (/qr -> redirects to /?autoDownload=1&source=qr)
  if (pathname === "/qr") {
    res.writeHead(302, { Location: "/?autoDownload=1&source=qr#apk-hub" });
    res.end();
    return;
  }

  // 6. Serve Static Files (with HTTP Range support for MP4 videos)
  let safePath = pathname === "/" ? "/index.html" : pathname;
  let filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const notFoundPage = path.join(PUBLIC_DIR, "404.html");
    if (fs.existsSync(notFoundPage)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(notFoundPage).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
    }
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const stat = fs.statSync(filePath);
  const range = req.headers.range;

  if (range && (ext === ".mp4" || ext === ".mp3" || ext === ".wav")) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": contentType
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  const headers = {
    "Content-Type": contentType,
    "Content-Length": stat.size,
    "Accept-Ranges": "bytes"
  };
  if (ext === ".apk") {
    headers["Content-Disposition"] = `attachment; filename="${path.basename(filePath)}"`;
  }
  res.writeHead(200, headers);
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  const lanIp = getLanIp();
  console.log(`AlarmMates Real-Time Website Server running:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://${lanIp}:${PORT}`);

  syncGitHubReleasesCount();
  setInterval(syncGitHubReleasesCount, 60000);

  // Skip local SSH tunnel when running in cloud environments (Render, Vercel, Railway)
  const isCloud = Boolean(process.env.RENDER || process.env.VERCEL || process.env.NODE_ENV === "production");
  if (!isCloud) {
    const sshBin = process.platform === "win32" ? "ssh.exe" : "ssh";
    function startPublicPhoneTunnel() {
      try {
        const sshProc = spawn(
          sshBin,
          [
            "-T",
            "-o", "StrictHostKeyChecking=no",
            "-o", "ServerAliveInterval=20",
            "-o", "ExitOnForwardFailure=yes",
            "-R", `80:127.0.0.1:${PORT}`,
            "nokey@localhost.run"
          ],
          { stdio: ["pipe", "pipe", "pipe"] }
        );
        sshProc.on("error", (err) => {
          console.warn("Local tunnel not available:", err.message);
        });
        const handleChunk = (chunk) => {
          const text = chunk.toString("utf8");
          const match = text.match(/https:\/\/[a-z0-9-]+\.lhr\.life/i);
          if (match && match[0]) {
            const pubUrl = match[0].trim();
            if (db.publicTunnelUrl !== pubUrl) {
              db.publicTunnelUrl = pubUrl;
              saveDb(db);
              broadcastStats();
              console.log(`  Public Phone Link (Works Anywhere!): ${pubUrl}`);
              console.log(`  Public Phone Auto-Download QR URL:   ${pubUrl}/qr`);
            }
          }
        };
        sshProc.stdout.on("data", handleChunk);
        sshProc.stderr.on("data", handleChunk);
        sshProc.on("exit", () => {
          setTimeout(startPublicPhoneTunnel, 5000);
        });
      } catch (e) {
        console.warn("Tunnel error:", e.message);
      }
    }
    startPublicPhoneTunnel();
  }
});
