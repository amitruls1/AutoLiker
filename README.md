# Auto Date Liker 🔥

A Chrome / Edge extension that auto-likes profiles on **Tinder**, **Bumble**, **Happn** & **OKCupid** — with smart speed controls, live like counters, and a sleek dark-mode UI.

---

## Features

| Feature | Details |
|---------|---------|
| **Supported platforms** | Tinder · Bumble · Happn · OKCupid |
| **Start / Stop toggle** | One-click toggle per platform — no more "refresh to stop" |
| **Speed control** | Per-platform slider from Blazing (200 ms) to Very Slow (3 s) |
| **Live like counter** | See your likes tick up in real-time inside the popup |
| **OKCupid messaging** | Enter a custom pickup line or let the extension pick a random one |
| **Auto site detection** | Popup highlights which dating site you're currently on |
| **Settings persistence** | Speed and message preferences are saved across sessions |
| **Dark glassmorphism UI** | Premium, modern design — zero external CDN dependencies |

---

## Installation

1. Clone or download this repository.
2. Open **Google Chrome** → `chrome://extensions`  
   *(or **Microsoft Edge** → `edge://extensions`)*
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `AutoLiker` folder.
5. The 🔥 icon appears in your toolbar — you're ready!

## Usage

1. Navigate to one of the supported dating sites and **log in**.
2. Go to the **match / discovery** page (where profiles are shown).
3. Click the extension icon to open the popup.
4. Adjust speed if desired, then **toggle the platform** ON.
5. Watch the likes roll in! Toggle OFF when you want to stop.

> **Tip (OKCupid):** Go to OKCupid → select the *Online* stack → toggle on OKCupid. You'll get tons of matches with auto-messages.

---

## File Structure

```
AutoLiker/
├── manifest.json   # Extension manifest (Manifest V3)
├── background.js   # Service worker — message relay & state
├── popup.html      # Popup UI
├── popup.css       # Glassmorphism dark theme
├── popup.js        # Popup controller
├── content.js      # Auto-like logic (injected into dating sites)
├── icon.png        # Extension icon
└── README.md
```

---

## License

ISC — © Amit Chauhan
