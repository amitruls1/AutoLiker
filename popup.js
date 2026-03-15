// ═══════════════════════════════════════════════════════════
// Auto Date Liker — Popup Controller
// Handles UI interactions and communicates with background.js
// ═══════════════════════════════════════════════════════════

const PLATFORMS = ["tinder", "bumble", "happn", "okcupid"];

const SITE_MAP = {
  "tinder.com": "tinder",
  "bumble.com": "bumble",
  "happn.com": "happn",
  "okcupid.com": "okcupid",
};

// ── DOM References ──────────────────────────────────────────

const els = {};
PLATFORMS.forEach((p) => {
  els[p] = {
    toggle: document.getElementById(`${p}Toggle`),
    count: document.getElementById(`${p}Count`),
    speed: document.getElementById(`${p}Speed`),
    speedLabel: document.getElementById(`${p}SpeedLabel`),
  };
});

const siteDot = document.getElementById("siteDot");
const siteName = document.getElementById("siteName");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const totalLikesEl = document.getElementById("totalLikes");
const okcupidMsg = document.getElementById("okcupidMsg");

let detectedPlatform = null;
let activePlatform = null;
let likeCounts = { tinder: 0, bumble: 0, happn: 0, okcupid: 0 };

// ── Helpers ─────────────────────────────────────────────────

function speedLabel(ms) {
  if (ms <= 400) return "Blazing";
  if (ms <= 800) return "Fast";
  if (ms <= 1500) return "Normal";
  if (ms <= 2500) return "Slow";
  return "Very Slow";
}

function updateTotalLikes() {
  const total = Object.values(likeCounts).reduce((a, b) => a + b, 0);
  totalLikesEl.textContent = `${total} total like${total !== 1 ? "s" : ""}`;
}

function setStatus(running, platform) {
  if (running) {
    statusDot.classList.add("running");
    statusText.textContent = `Running on ${platform}`;
  } else {
    statusDot.classList.remove("running");
    statusText.textContent = "Idle";
  }
}

function setToggleActive(platform, active) {
  const btn = els[platform].toggle;
  if (active) {
    btn.classList.add("active");
  } else {
    btn.classList.remove("active");
  }
}

// ── Detect Current Site ─────────────────────────────────────

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs[0] || !tabs[0].url) return;
  const url = tabs[0].url;
  for (const [domain, platform] of Object.entries(SITE_MAP)) {
    if (url.includes(domain)) {
      detectedPlatform = platform;
      siteDot.classList.add("active");
      siteName.innerHTML = `Detected: <strong>${platform.charAt(0).toUpperCase() + platform.slice(1)}</strong>`;
      break;
    }
  }
});

// ── Restore state from background ───────────────────────────

chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
  if (chrome.runtime.lastError || !response) return;
  if (response.running && response.platform) {
    activePlatform = response.platform;
    likeCounts[response.platform] = response.likes || 0;
    els[response.platform].count.textContent = likeCounts[response.platform];
    setToggleActive(response.platform, true);
    setStatus(true, response.platform);
    updateTotalLikes();
  }
});

// ── Load saved settings ─────────────────────────────────────

chrome.storage.local.get(["speeds", "okcupidMessage"], (data) => {
  if (data.speeds) {
    PLATFORMS.forEach((p) => {
      if (data.speeds[p] !== undefined) {
        els[p].speed.value = data.speeds[p];
      }
    });
  }
  if (data.okcupidMessage) {
    okcupidMsg.value = data.okcupidMessage;
  }
  // Update all speed labels
  PLATFORMS.forEach((p) => {
    els[p].speedLabel.textContent = speedLabel(parseInt(els[p].speed.value));
  });
});

// ── Speed slider handlers ───────────────────────────────────

PLATFORMS.forEach((p) => {
  els[p].speed.addEventListener("input", () => {
    const val = parseInt(els[p].speed.value);
    els[p].speedLabel.textContent = speedLabel(val);

    // Save to storage
    chrome.storage.local.get(["speeds"], (data) => {
      const speeds = data.speeds || {};
      speeds[p] = val;
      chrome.storage.local.set({ speeds });
    });
  });
});

// ── OKCupid message save ────────────────────────────────────

okcupidMsg.addEventListener("input", () => {
  chrome.storage.local.set({ okcupidMessage: okcupidMsg.value });
});

// ── Toggle handlers ─────────────────────────────────────────

PLATFORMS.forEach((p) => {
  els[p].toggle.addEventListener("click", () => {
    const isCurrentlyActive = els[p].toggle.classList.contains("active");

    if (isCurrentlyActive) {
      // Stop this platform
      chrome.runtime.sendMessage({ action: "stopLiking" }, () => {
        setToggleActive(p, false);
        activePlatform = null;
        setStatus(false);
      });
    } else {
      // Stop any running platform first
      if (activePlatform) {
        setToggleActive(activePlatform, false);
        chrome.runtime.sendMessage({ action: "stopLiking" });
      }

      // Start this platform
      const interval = parseInt(els[p].speed.value);
      const msg = {
        action: "startLiking",
        platform: p,
        interval,
      };

      if (p === "okcupid") {
        msg.okcupidMessage = okcupidMsg.value;
      }

      chrome.runtime.sendMessage(msg, () => {
        activePlatform = p;
        setToggleActive(p, true);
        setStatus(true, p);
      });
    }
  });
});

// ── Poll for like count updates ─────────────────────────────

setInterval(() => {
  chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
    if (chrome.runtime.lastError || !response) return;
    if (response.running && response.platform) {
      const p = response.platform;
      const oldCount = likeCounts[p];
      likeCounts[p] = response.likes || 0;
      if (likeCounts[p] !== oldCount) {
        els[p].count.textContent = likeCounts[p];
        // Bump animation
        els[p].count.classList.remove("count-bump");
        void els[p].count.offsetWidth; // force reflow
        els[p].count.classList.add("count-bump");
        updateTotalLikes();
      }
    }
    if (!response.running && activePlatform) {
      setToggleActive(activePlatform, false);
      activePlatform = null;
      setStatus(false);
    }
  });
}, 1000);
