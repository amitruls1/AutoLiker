// Background service worker — relays messages between popup and content scripts
// and tracks per-tab liking state.

const tabState = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action } = message;

  // ── Messages from popup ──────────────────────────────────────────
  if (action === "startLiking") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      const tabId = tabs[0].id;
      tabState[tabId] = { running: true, platform: message.platform, likes: 0 };
      chrome.tabs.sendMessage(tabId, {
        action: "start",
        platform: message.platform,
        interval: message.interval,
        okcupidMessage: message.okcupidMessage || "",
      });
      sendResponse({ ok: true });
    });
    return true; // async sendResponse
  }

  if (action === "stopLiking") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      const tabId = tabs[0].id;
      if (tabState[tabId]) tabState[tabId].running = false;
      chrome.tabs.sendMessage(tabId, { action: "stop" });
      sendResponse({ ok: true });
    });
    return true;
  }

  if (action === "getStatus") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        sendResponse({ running: false, likes: 0, platform: null });
        return;
      }
      const tabId = tabs[0].id;
      const state = tabState[tabId] || { running: false, likes: 0, platform: null };
      sendResponse(state);
    });
    return true;
  }

  // ── Messages from content script ─────────────────────────────────
  if (action === "likeUpdate" && sender.tab) {
    const tabId = sender.tab.id;
    if (tabState[tabId]) {
      tabState[tabId].likes = message.likes;
    }
  }

  if (action === "stopped" && sender.tab) {
    const tabId = sender.tab.id;
    if (tabState[tabId]) {
      tabState[tabId].running = false;
    }
  }
});

// Clean up state when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabState[tabId];
});
