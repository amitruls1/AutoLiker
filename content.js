// ═══════════════════════════════════════════════════════════
// Auto Date Liker — Content Script
// Injected into dating sites. Receives start/stop commands from
// the background service worker and performs auto-liking.
// ═══════════════════════════════════════════════════════════

let intervalId = null;
let okcupidRunning = false;
let likeCount = 0;

// ── Message Listener ────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, platform, interval, okcupidMessage } = message;

  if (action === "start") {
    stopAll(); // clear any existing run
    likeCount = 0;
    console.log(
      `%c[Auto Date Liker] Starting ${platform} (interval: ${interval}ms)`,
      "color: #4ade80; font-weight: 600; font-size: 13px;"
    );

    switch (platform) {
      case "tinder":
        startTinder(interval);
        break;
      case "bumble":
        startBumble(interval);
        break;
      case "happn":
        startHappn(interval);
        break;
      case "okcupid":
        startOkCupid(interval, okcupidMessage);
        break;
    }
    sendResponse({ ok: true });
  }

  if (action === "stop") {
    stopAll();
    console.log(
      `%c[Auto Date Liker] Stopped. Total likes: ${likeCount}`,
      "color: #f87171; font-weight: 600; font-size: 13px;"
    );
    sendResponse({ ok: true });
  }
});

// ── Stop Everything ─────────────────────────────────────────

function stopAll() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  okcupidRunning = false;
  chrome.runtime.sendMessage({ action: "stopped" });
}

// ── Like Count Reporter ─────────────────────────────────────

function reportLike() {
  likeCount++;
  chrome.runtime.sendMessage({ action: "likeUpdate", likes: likeCount });
  console.log(
    `%c♥ Like #${likeCount}`,
    "color: #4ade80; font-weight: 600;"
  );
}

// ── Tinder ──────────────────────────────────────────────────
// Tinder Web uses several possible selectors for the "Like" button.
// We try multiple known selectors in order of likelihood.

function findTinderLikeButton() {
  // Primary: aria-label based (most reliable)
  const ariaBtn = document.querySelector(
    'button[aria-label="Like"], button[aria-label="like"]'
  );
  if (ariaBtn) return ariaBtn;

  // Secondary: The big game-card action buttons – like is typically the
  // rightmost green-heart-icon button in the action bar
  const gameActions = document.querySelectorAll(
    ".gamepad-button, .recsGamepad button"
  );
  for (const btn of gameActions) {
    const svg = btn.querySelector('svg path, svg use');
    const label = btn.getAttribute("aria-label") || btn.innerText || "";
    if (
      label.toLowerCase().includes("like") &&
      !label.toLowerCase().includes("super") &&
      !label.toLowerCase().includes("nope")
    ) {
      return btn;
    }
  }

  // Tertiary: Legacy selector from older Tinder web
  const legacyBtns = document.querySelectorAll(".button");
  for (const btn of legacyBtns) {
    if (btn.innerText && btn.innerText.toLowerCase().trim() === "like") {
      return btn;
    }
  }

  return null;
}

function startTinder(interval) {
  intervalId = setInterval(() => {
    try {
      const btn = findTinderLikeButton();
      if (btn) {
        btn.click();
        reportLike();
      } else {
        console.log(
          "%c[Auto Date Liker] Tinder like button not found – waiting…",
          "color: #fbbf24;"
        );
      }
    } catch (e) {
      console.error("[Auto Date Liker] Tinder error:", e);
    }
  }, interval);
}

// ── Bumble ──────────────────────────────────────────────────

function findBumbleLikeButton() {
  // Primary: The encounter like button
  const encounter = document.querySelector(
    ".encounters-action--like, .encounters-action__button--like"
  );
  if (encounter) return encounter;

  // Secondary: Vote yes button
  const vote = document.querySelector(
    'button[data-qa-role="encounters-action-like"], [class*="vote-yes"]'
  );
  if (vote) return vote;

  return null;
}

function startBumble(interval) {
  intervalId = setInterval(() => {
    try {
      const btn = findBumbleLikeButton();
      if (btn) {
        // Bumble often needs a proper event, not just .click()
        const evDown = new PointerEvent("pointerdown", { bubbles: true });
        const evUp = new PointerEvent("pointerup", { bubbles: true });
        btn.dispatchEvent(evDown);
        btn.dispatchEvent(evUp);
        btn.click();
        reportLike();
      } else {
        console.log(
          "%c[Auto Date Liker] Bumble like button not found – waiting…",
          "color: #fbbf24;"
        );
      }
    } catch (e) {
      console.error("[Auto Date Liker] Bumble error:", e);
    }
  }, interval);
}

// ── Happn ───────────────────────────────────────────────────

function findHappnLikeButton() {
  const btn = document.querySelector(
    "[data-testid='profile-btn-like'], button[aria-label='Like'], .action-like"
  );
  return btn || null;
}

function startHappn(interval) {
  intervalId = setInterval(() => {
    try {
      const btn = findHappnLikeButton();
      if (btn) {
        btn.click();
        reportLike();
      }
      // Auto-dismiss modals
      const modal = document.querySelector(
        "[data-testid='onboarding-modal-confirm']"
      );
      if (modal) modal.click();
    } catch (e) {
      console.error("[Auto Date Liker] Happn error:", e);
    }
  }, interval);
}

// ── OKCupid ─────────────────────────────────────────────────
// OKCupid is async-heavy: open messaging → type → send → close → repeat.
// Uses setTimeout-based loop instead of recursive calls to avoid stack overflow.

const pickupLines = [
  "If you were words on a page, you'd be the fine print.",
  "Is this the Hogwarts Express? Because it feels like you and I are headed somewhere magical.",
  "I'm going to complain to Spotify about you not being this week's hottest single.",
  "Are you a camera? Because every time I look at you, I smile.",
  "Want a raisin? No? Well, how about a date?",
  "You must be a magician. Because any time I look at you, everyone else disappears.",
  "I think you're suffering from a lack of vitamin me.",
  "If I could rearrange the alphabet, I'd put 'I' and 'U' together.",
  "Was your dad a boxer? Because you're a knockout!",
  "I may not be a photographer, but I can totally picture us together.",
  "Kiss me if I'm wrong, but dinosaurs still exist, right?",
  "Hey, my name's Microsoft. Can I crash at your place?",
  "You owe me a drink. Because when I looked at you, I dropped mine!",
];

function randomPickupLine() {
  return pickupLines[Math.floor(Math.random() * pickupLines.length)];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function okcupidCycle(userMessage, delay) {
  if (!okcupidRunning) return;

  try {
    // Click the comment/intro button
    const introBtn = document.querySelector(
      ".dt-comment-fab, [data-cy='discovery.intros.send-intro'], button[aria-label='Intro']"
    );
    if (introBtn) {
      introBtn.click();
      await sleep(Math.max(delay, 2000));
    }

    if (!okcupidRunning) return;

    // Type the message
    const messageInput = document.querySelector(
      "[data-cy='messenger.messageInput'], textarea[name='message'], .messenger-composer textarea"
    );
    if (messageInput) {
      const line = userMessage || randomPickupLine();
      // Set value using native input setter for React compatibility
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, "value"
      )?.set || Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value"
      )?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(messageInput, line);
      } else {
        messageInput.value = line;
      }
      messageInput.dispatchEvent(new Event("input", { bubbles: true }));
      await sleep(1000);
    }

    if (!okcupidRunning) return;

    // Click send
    const sendBtn = document.querySelector(
      "[data-cy='messenger.sendButton'], button[type='submit'], .messenger-composer button"
    );
    if (sendBtn) {
      sendBtn.click();
      reportLike();
      await sleep(Math.max(delay, 2000));
    }

    if (!okcupidRunning) return;

    // Close messenger
    const closeBtn = document.querySelector(
      "[data-cy='messenger.closeButton'], button[aria-label='Close'], .messenger-header button"
    );
    if (closeBtn) {
      closeBtn.click();
      await sleep(Math.max(delay, 2000));
    }
  } catch (e) {
    console.error("[Auto Date Liker] OKCupid error:", e);
    await sleep(2000);
    // Try to close messenger if stuck open
    try {
      const closeBtn = document.querySelector(
        "[data-cy='messenger.closeButton'], button[aria-label='Close']"
      );
      if (closeBtn) closeBtn.click();
    } catch (_) {}
    await sleep(1500);
  }

  // Continue loop (non-recursive via setTimeout)
  if (okcupidRunning) {
    setTimeout(() => okcupidCycle(userMessage, delay), 500);
  }
}

function startOkCupid(interval, userMessage) {
  okcupidRunning = true;
  okcupidCycle(userMessage, interval);
}
