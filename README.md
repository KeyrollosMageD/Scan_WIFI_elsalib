# QR Event Countdown Landing Page

A warm, fully responsive single-page website built with plain HTML, CSS, and vanilla JavaScript — designed to open quickly from a QR code on both phones and laptops.

## Project Files

- `index.html` — Page structure, favicon links, and Open Graph / social preview meta tags
- `style.css` — Fluid responsive layout (Flexbox/Grid with relative units only), golden-hour sunset color palette, and subtle golden glow animations
- `script.js` — Time-zone-aware live countdown timer (`Africa/Cairo` by default)
- `poster.jpg` — Event poster image (currently set to your uploaded golden-hour cross poster)
- `favicon.svg` & `favicon.ico` — Warm golden-hour cross browser tab icons

---

## 1. Replacing the Poster Image (`poster.jpg`)

1. Prepare your new poster image as a `.jpg` file (square `1:1`, portrait `4:5` / `2:3`, or landscape all scale cleanly).
2. Rename the image file to **`poster.jpg`**.
3. Place it in the root project folder (`Free_WIFI/`), overwriting the existing `poster.jpg`.

> **Tip:** If you use a `.png` or `.webp` image instead (e.g., `poster.png`), update `poster.jpg` in `index.html` in the `<img src="...">` tag as well as the `og:image` and `twitter:image` `<meta>` tags. Once deployed online, set `og:image` and `twitter:image` to your full URL (e.g., `https://yourdomain.com/poster.jpg`) for rich WhatsApp/Facebook link previews.

---

## 2. Changing the Countdown Date & Time

Open **`script.js`** and edit the two configuration constants at the top of the file:

```js
const TARGET_DATETIME = "2026-11-26T19:00:00";
const TARGET_TIMEZONE = "Africa/Cairo";
```

- **`TARGET_DATETIME`** uses 24-hour `YYYY-MM-DDTHH:mm:ss` format:
  - `2026-11-26` → Date (`Year-Month-Day`)
  - `19:00:00` → Time (`7:00 PM` in 24-hour clock; e.g., `20:30:00` for `8:30 PM`, `09:00:00` for `9:00 AM`)
- **`TARGET_TIMEZONE`** accepts any standard [IANA time zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (such as `"Africa/Cairo"`, `"UTC"`, `"Europe/London"`, or `"America/New_York"`), ensuring the countdown finishes at the exact same moment for everyone regardless of their phone or laptop clock settings.

When the countdown reaches zero, the three boxes automatically hide and display **`It's showtime!`**.

---

## Color Palette

| Role | Hex | Description |
| :--- | :--- | :--- |
| Background | `#2B1A10` | Deep warm brown |
| Primary Accent | `#E8833A` | Sunset orange |
| Secondary Accent | `#8C1F28` | Dark crimson |
| Light Text & Card Surfaces | `#F5E6D3` | Soft cream beige |
| Highlight | `#F4C95D` | Golden glow |
