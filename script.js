/**
 * ============================================================================
 * Countdown Configuration
 * ============================================================================
 * Change TARGET_DATETIME and TARGET_TIMEZONE below to update the countdown.
 *
 * - TARGET_DATETIME: Local date & time in "YYYY-MM-DDTHH:mm:ss" (24-hour) format.
 *   Example: "2026-11-26T19:00:00" = November 26, 2026 at 7:00 PM.
 * - TARGET_TIMEZONE: IANA time zone name (e.g., "Africa/Cairo", "UTC",
 *   "Europe/London", "America/New_York"). Ensures every visitor sees the exact
 *   same countdown regardless of what time zone their phone or laptop is in.
 */
const TARGET_DATETIME = "2026-11-26T19:00:00";
const TARGET_TIMEZONE = "Africa/Cairo";

/**
 * Converts a wall-clock date/time string ("YYYY-MM-DDTHH:mm:ss") in a given
 * IANA time zone into an exact UTC timestamp (milliseconds since epoch).
 * Also accepts ISO strings that already include an offset (e.g., "+02:00" or "Z").
 */
function getTargetTimestamp(dateTimeString, timeZone) {
  // If the string already contains an explicit timezone offset or "Z", parse directly
  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(dateTimeString.trim())) {
    return Date.parse(dateTimeString);
  }

  const match = dateTimeString
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) {
    console.error("Invalid TARGET_DATETIME format. Expected YYYY-MM-DDTHH:mm:ss");
    return Date.now();
  }

  const [, year, month, day, hour, minute, second = "00"] = match;
  const utcGuess = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  // Helper to get the time zone's offset (in ms) at any given UTC instant
  function getTimeZoneOffsetMs(instantMs) {
    const parts = {};
    for (const part of formatter.formatToParts(new Date(instantMs))) {
      if (part.type !== "literal") {
        parts[part.type] = Number(part.value);
      }
    }
    const zonedAsUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour === 24 ? 0 : parts.hour,
      parts.minute,
      parts.second
    );
    return zonedAsUtc - instantMs;
  }

  // Two-pass calculation handles Daylight Saving Time transitions accurately
  const firstPass = utcGuess - getTimeZoneOffsetMs(utcGuess);
  return utcGuess - getTimeZoneOffsetMs(firstPass);
}

/**
 * Initializes and runs the live countdown timer.
 */
(function initCountdown() {
  const gridEl = document.getElementById("countdown-grid");
  const showtimeEl = document.getElementById("showtime-message");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  const targetTimestamp = getTargetTimestamp(TARGET_DATETIME, TARGET_TIMEZONE);
  const previousValues = { hours: null, minutes: null, seconds: null };
  let timerId = null;

  /**
   * Formats a non-negative integer to at least 2 digits (e.g., 5 -> "05", 120 -> "120").
   */
  function padNumber(value) {
    return String(value).padStart(2, "0");
  }

  /**
   * Updates a box's text only when its value changes and plays a subtle tick pulse.
   */
  function setBoxValue(element, key, nextValue, animate) {
    if (previousValues[key] === nextValue) {
      return;
    }
    previousValues[key] = nextValue;
    element.textContent = nextValue;

    if (!animate) {
      return;
    }

    const box = element.closest(".countdown__box");
    if (!box) {
      return;
    }

    box.classList.add("is-ticking");
    window.setTimeout(() => {
      box.classList.remove("is-ticking");
    }, 220);
  }

  /**
   * Switches the UI from the three number boxes to "It's showtime!".
   */
  function showShowtime() {
    gridEl.hidden = true;
    showtimeEl.hidden = false;
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  /**
   * Calculates remaining hours, minutes, and seconds and updates the DOM.
   */
  function updateCountdown(isInitialRender = false) {
    const remainingMs = targetTimestamp - Date.now();

    if (remainingMs <= 0) {
      showShowtime();
      return;
    }

    // Total remaining seconds, converted into total Hours, Minutes, and Seconds
    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const animate = !isInitialRender;
    setBoxValue(hoursEl, "hours", padNumber(hours), animate);
    setBoxValue(minutesEl, "minutes", padNumber(minutes), animate);
    setBoxValue(secondsEl, "seconds", padNumber(seconds), animate);
  }

  // Render immediately on page load so there is no 1-second blank delay
  updateCountdown(true);

  // Poll 4x per second so second transitions stay crisp even after phone sleep
  if (!showtimeEl.hidden) {
    return;
  }
  timerId = window.setInterval(() => updateCountdown(false), 250);

  // Refresh immediately when returning to the browser tab on mobile/desktop
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && timerId !== null) {
      updateCountdown(false);
    }
  });
})();
