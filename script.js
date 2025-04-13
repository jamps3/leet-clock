document.addEventListener("DOMContentLoaded", () => {
  let showSeconds = false;
  const centerX = 200;
  const centerY = 200;
  let mode = "leet";

  const modeSettings = {
    leet: {
      hours: 13,
      minutes: 37,
      seconds: 37,
      label: "Leet time",
      offset: 13 * 3600 + 37 * 60,
      hourFont: 24,
      minuteFont: 12,
    },
    real: {
      hours: 12,
      minutes: 60,
      seconds: 60,
      label: "Real time 12h",
      hourFont: 24,
      minuteFont: 8,
    },
    real24: {
      hours: 24,
      minutes: 60,
      seconds: 60,
      label: "Real time 24h",
      hourFont: 18,
      minuteFont: 8,
    },
    sata: {
      hours: 100,
      minutes: 100,
      seconds: 100,
      label: "Sata time",
      hourFont: 4,
      minuteFont: 5,
    },
    relative: {
      hours: 12,
      minutes: 60,
      seconds: 60,
      label: "Relative Hour",
      hourFont: 24,
      minuteFont: 8,
    },
    binary: {
      hours: 16,
      minutes: 64,
      seconds: 64,
      label: "Binary time",
      hourFont: 24,
      minuteFont: 8,
    },
    martian: {
      hours: 24,
      minutes: 60,
      seconds: 60,
      label: "Martian time",
      hourFont: 18,
      minuteFont: 8,
    },
    hex: {
      hours: 16,
      minutes: 16,
      seconds: 16,
      label: "Hex time",
      hourFont: 24,
      minuteFont: 12,
    },
  };

  const labelGroup = document.getElementById("labels");
  const SATA_CYCLE_SECONDS = 100 * 100 * 100;
  const EARTH_DAY_SECONDS = 86400;
  const MARTIAN_DAY_SECONDS = 88775;

  const secondDurations = {
    leet: (EARTH_DAY_SECONDS / (13 * 37 * 37)) * 1000, // ~2337ms
    real: 1000,
    real24: 1000,
    sata: (EARTH_DAY_SECONDS / SATA_CYCLE_SECONDS) * 1000, // ~864ms
    relative: 1000, // Dynamic
    binary: (EARTH_DAY_SECONDS / (16 * 64 * 64)) * 1000, // ~1322ms
    martian: (MARTIAN_DAY_SECONDS / (24 * 60 * 60)) * 1000, // ~1479ms
    hex: (EARTH_DAY_SECONDS / (16 * 16 * 16)) * 1000, // ~33750ms
  };

  function drawLabels(hourCount, minuteCount) {
    try {
      labelGroup.innerHTML = "";
      const hourRadius = 125;
      const minuteRadius = 168;
      const settings = modeSettings[mode];
      const isHexMode = mode === "hex";

      const toHexLabel = (num) =>
        isHexMode ? num.toString(16).toUpperCase() : num.toString();

      for (let i = 0; i < hourCount; i++) {
        const angle = ((360 / hourCount) * i - 90) * (Math.PI / 180);
        const x = centerX + hourRadius * Math.cos(angle);
        const y = centerY + hourRadius * Math.sin(angle);
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("font-size", settings.hourFont * 1.5);
        text.setAttribute("fill", "lime");
        text.textContent = toHexLabel(i);
        labelGroup.appendChild(text);
      }
      for (let i = 0; i < minuteCount; i++) {
        const angle = ((360 / minuteCount) * i - 90) * (Math.PI / 180);
        const x = centerX + minuteRadius * Math.cos(angle);
        const y = centerY + minuteRadius * Math.sin(angle);
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("font-size", settings.minuteFont * 1.5);
        text.setAttribute("fill", "lime");
        text.textContent = toHexLabel(i);
        labelGroup.appendChild(text);
      }
    } catch (error) {
      console.error("Error in drawLabels:", error);
    }
  }

  function getSecondsSinceMidnight() {
    const now = new Date();
    return (
      now.getHours() * 3600 +
      now.getMinutes() * 60 +
      now.getSeconds() +
      now.getMilliseconds() / 1000
    );
  }

  function getModeTime() {
    const settings = modeSettings[mode];
    const now = new Date();
    const nowMs = now.getTime(); // Unified time source
    const earthSeconds = getSecondsSinceMidnight(nowMs);
    let hours, minutes, seconds, fraction, displaySeconds;

    if (mode === "sata") {
      const sataTotalSeconds =
        earthSeconds * (SATA_CYCLE_SECONDS / EARTH_DAY_SECONDS);
      seconds = Math.floor(sataTotalSeconds);
      fraction = sataTotalSeconds - seconds;
      displaySeconds = Math.round(sataTotalSeconds) % 100;
      hours = Math.floor(seconds / (100 * 100)) % 100;
      minutes = Math.floor(seconds / 100) % 100;
      seconds = seconds % 100;
    } else if (mode === "relative") {
      let latitude = window.userLocation?.latitude || 60.1699;
      let longitude = window.userLocation?.longitude || 24.9384;
      const times = SunCalc.getTimes(new Date(nowMs), latitude, longitude);
      const sunrise = times.sunrise.getTime();
      const sunset = times.sunset.getTime();
      const msInDay = 24 * 60 * 60 * 1000;
      let isDaytime = nowMs >= sunrise && nowMs < sunset;
      let periodStart = isDaytime ? sunrise : sunset;
      let periodEnd = isDaytime ? sunset : sunrise + msInDay;
      let periodLength = periodEnd - periodStart;
      let elapsed = (nowMs - periodStart + msInDay) % msInDay;
      let relativeHourLength = periodLength / 12;
      hours = Math.floor(elapsed / relativeHourLength);
      minutes = Math.floor(
        (elapsed % relativeHourLength) / (relativeHourLength / 60)
      );
      seconds = Math.floor(
        (elapsed % (relativeHourLength / 60)) / (relativeHourLength / 3600)
      );
      fraction =
        (elapsed % (relativeHourLength / 3600)) / (relativeHourLength / 3600);
      displaySeconds = Math.round(seconds + fraction) % 60;
    } else if (mode === "real") {
      hours = now.getHours() % 12 || 12;
      minutes = now.getMinutes();
      seconds = Math.floor(nowMs / 1000) % 60;
      fraction = (nowMs % 1000) / 1000;
      displaySeconds = seconds;
    } else if (mode === "real24") {
      hours = now.getHours();
      minutes = now.getMinutes();
      seconds = Math.floor(nowMs / 1000) % 60;
      fraction = (nowMs % 1000) / 1000;
      displaySeconds = seconds;
    } else if (mode === "martian") {
      const martianSeconds =
        earthSeconds * (MARTIAN_DAY_SECONDS / EARTH_DAY_SECONDS);
      const totalMinutes = martianSeconds / 3600;
      hours = Math.floor(totalMinutes / 60) % 24;
      minutes = Math.floor(totalMinutes % 60);
      seconds = Math.floor((martianSeconds % 3600) / 60);
      fraction = (martianSeconds % 60) / 60;
      displaySeconds = Math.round(seconds + fraction) % 60;
    } else {
      const offset = settings.offset || 0;
      const adjustedSeconds =
        (earthSeconds - offset + EARTH_DAY_SECONDS) % EARTH_DAY_SECONDS;
      const fractionOfDay = adjustedSeconds / EARTH_DAY_SECONDS;
      const secondCount = settings.seconds;
      const totalSeconds =
        fractionOfDay * (settings.hours * settings.minutes * secondCount);
      seconds = Math.floor(totalSeconds);
      fraction = totalSeconds - seconds;
      displaySeconds = seconds % secondCount;
      hours =
        Math.floor(seconds / (settings.minutes * secondCount)) % settings.hours;
      minutes = Math.floor(seconds / secondCount) % settings.minutes;
      seconds = seconds % secondCount;
    }

    return { hours, minutes, seconds, fraction, displaySeconds };
  }

  function updateClockHands(time) {
    const settings = modeSettings[mode];
    const secondCount = settings.seconds;
    const secondAngle = (time.seconds + time.fraction) * (360 / secondCount);
    const minuteAngle =
      (time.minutes + (time.seconds + time.fraction) / secondCount) *
      (360 / settings.minutes);
    const hourAngle =
      (time.hours +
        time.minutes / settings.minutes +
        (time.seconds + time.fraction) / (settings.minutes * secondCount)) *
      (360 / settings.hours);

    setHand("secondHand", secondAngle, 45);
    setHand("minuteHand", minuteAngle, 39);
    setHand("hourHand", hourAngle, 25);
  }

  function setHand(id, angleDeg, lengthPercentage) {
    const length = (lengthPercentage / 100) * 400;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const x2 = centerX + length * Math.cos(angleRad);
    const y2 = centerY + length * Math.sin(angleRad);
    const hand = document.getElementById(id);
    if (!hand) {
      console.error(`Hand element with ID ${id} not found`);
      return;
    }
    hand.setAttribute("x2", x2);
    hand.setAttribute("y2", y2);
  }

  function timeToNextSecond(time) {
    if (mode === "relative") {
      const nowMs = Date.now();
      const latitude = window.userLocation?.latitude || 60.1699;
      const longitude = window.userLocation?.longitude || 24.9384;
      const times = SunCalc.getTimes(new Date(nowMs), latitude, longitude);
      const sunrise = times.sunrise.getTime();
      const sunset = times.sunset.getTime();
      const msInDay = 24 * 60 * 60 * 1000;
      const isDaytime = nowMs >= sunrise && nowMs < sunset;
      const periodStart = isDaytime ? sunrise : sunset;
      const periodEnd = isDaytime ? sunset : sunrise + msInDay;
      const periodLength = periodEnd - periodStart;
      const relativeHourLength = periodLength / 12;
      const relativeSecondLength = relativeHourLength / (60 * 60);
      const elapsed = (nowMs - periodStart + msInDay) % msInDay;
      const secondsElapsed = elapsed / relativeSecondLength;
      return relativeSecondLength * (1 - (secondsElapsed % 1));
    }
    const duration = secondDurations[mode];
    return duration * (1 - (time.fraction % 1));
  }

  function getSecondsSinceMidnight(nowMs = Date.now()) {
    return (nowMs / 1000) % EARTH_DAY_SECONDS;
  }

  function updateClock() {
    try {
      const time = getModeTime();
      const date = new Date();
      const realHours = date.getHours();
      const realMinutes = date.getMinutes();
      const realSeconds = date.getSeconds();

      updateClockHands(time);

      document
        .getElementById("minuteHand")
        .setAttribute("stroke-width", (0.75 / 100) * 400);
      document
        .getElementById("hourHand")
        .setAttribute("stroke-width", (1.5 / 100) * 400);
      document
        .getElementById("secondHand")
        .setAttribute("stroke-width", (0.25 / 100) * 400);
      document
        .querySelector("svg circle[stroke='lime']")
        .setAttribute("stroke-width", (1 / 100) * 400);
      document
        .querySelector("svg circle[fill='lime']")
        .setAttribute("r", (2.5 / 100) * 400);

      const settings = modeSettings[mode];
      const toHex = (num) =>
        mode === "hex" ? num.toString(16).toUpperCase() : num.toString();
      document.getElementById("digital").textContent = `${
        settings.label
      }: ${toHex(time.hours).padStart(2, "0")}:${toHex(time.minutes).padStart(
        2,
        "0"
      )}${
        showSeconds ? `:${toHex(time.displaySeconds).padStart(2, "0")}` : ""
      }${
        (mode === "real" || mode === "relative") && !showSeconds
          ? realHours >= 12
            ? " PM"
            : " AM"
          : ""
      }`;

      if (realHours === 13 && realMinutes === 37 && realSeconds === 0) {
        const sound = document.getElementById("sound");
        if (!sound.src) {
          sound.src = "leet.wav";
        }
        sound.play();
        document.getElementById("quote").textContent =
          "🎉 13:37 Achieved! Stay leet. 🎉";
      }
      applyVisualEffects(mode);
    } catch (error) {
      console.error("Error in updateClock:", error);
    }
  }

  function runClock(lastUpdateMs = 0) {
    const nowMs = performance.now();
    const time = getModeTime();
    updateClockHands(time);
    const nextUpdate = timeToNextSecond(time);
    if (nextUpdate <= 16.67) {
      updateClock();
      setTimeout(
        () => requestAnimationFrame(() => runClock(nowMs)),
        nextUpdate
      );
    } else {
      requestAnimationFrame(() => runClock(nowMs));
    }
  }

  function updateQuote() {
    try {
      const quotes = [
        "All your base are belong to us.",
        "I'm in your clock, showing your time.",
        "Leetness is a mindset.",
        "Hack the planet.",
        "There is no spoon... just time.",
        "Kello 13:37 - aikaa olla leet.",
      ];
      document.getElementById("quote").textContent =
        quotes[Math.floor(Math.random() * quotes.length)];
    } catch (error) {
      console.error("Error in updateQuote:", error);
    }
  }

  function setTheme(isDark) {
    try {
      const root = document.documentElement;
      root.style.setProperty("--bg-color", isDark ? "black" : "white");
      root.style.setProperty(
        "--text-color",
        isDark ? "lime" : "var(--text-color-light)"
      );
      localStorage.setItem("leetClockTheme", isDark ? "dark" : "light");
    } catch (error) {
      console.error("Error in setTheme:", error);
    }
  }

  function applyVisualEffects(currentMode) {
    try {
      const clockElements = [
        document.querySelector("svg circle[stroke='lime']"),
        document.getElementById("minuteHand"),
        document.getElementById("hourHand"),
        document.getElementById("secondHand"),
        document.querySelector("svg circle[fill='lime']"),
        ...document.querySelectorAll("svg text[fill='lime']"),
      ];

      clockElements.forEach((el) => {
        if (el) {
          el.classList.remove("martian-glow", "binary-pulse", "hex-cyan");
        }
      });
      document.body.classList.remove("martian-background");

      if (currentMode === "martian") {
        clockElements.forEach((el) => {
          if (el) el.classList.add("martian-glow");
        });
        document.body.classList.add("martian-background");
      } else if (currentMode === "binary") {
        clockElements.forEach((el) => {
          if (el) el.classList.add("binary-pulse");
        });
      } else if (currentMode === "hex") {
        clockElements.forEach((el) => {
          if (el) el.classList.add("hex-cyan");
        });
      }
    } catch (error) {
      console.error("Error in applyVisualEffects:", error);
    }
  }

  document.getElementById("toggleTheme").addEventListener("click", () => {
    try {
      const currentBg = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-color")
        .trim();
      const isCurrentlyDark = currentBg === "black";
      setTheme(!isCurrentlyDark);
    } catch (error) {
      console.error("Error in toggleTheme handler:", error);
    }
  });

  document.getElementById("toggleMode").addEventListener("click", () => {
    try {
      const modes = Object.keys(modeSettings);
      const currentIndex = modes.indexOf(mode);
      mode = modes[(currentIndex + 1) % modes.length];
      localStorage.setItem("leetClockMode", mode);
      drawLabels(modeSettings[mode].hours, modeSettings[mode].minutes);
      document.getElementById(
        "toggleMode"
      ).textContent = `Mode: ${modeSettings[mode].label}`;
      applyVisualEffects(mode);

      const secondHand = document.getElementById("secondHand");
      const duration = Math.min(secondDurations[mode] / 1000, 5);
      secondHand.style.transition = `x2 ${duration}s linear, y2 ${duration}s linear`;

      updateClock();
    } catch (error) {
      console.error("Error in toggleMode handler:", error);
    }
  });

  document.getElementById("toggleSeconds").addEventListener("click", () => {
    try {
      showSeconds = !showSeconds;
      document.getElementById("toggleSeconds").textContent = `Show Seconds: ${
        showSeconds ? "ON" : "OFF"
      }`;
      localStorage.setItem("showSeconds", showSeconds.toString());
      updateClock();
    } catch (error) {
      console.error("Error in toggleSeconds handler:", error);
    }
  });

  const startupDiv = document.getElementById("startup");
  startupDiv.addEventListener("animationend", () => {
    startupDiv.style.display = "none";
    startupDiv.style.pointerEvents = "none";
  });

  const savedShowSeconds = localStorage.getItem("showSeconds");
  if (savedShowSeconds) {
    showSeconds = savedShowSeconds === "true";
    document.getElementById("toggleSeconds").textContent = `Show Seconds: ${
      showSeconds ? "ON" : "OFF"
    }`;
  }

  const savedMode = localStorage.getItem("leetClockMode");
  if (savedMode && modeSettings[savedMode]) {
    mode = savedMode;
  }
  drawLabels(modeSettings[mode].hours, modeSettings[mode].minutes);
  document.getElementById(
    "toggleMode"
  ).textContent = `Mode: ${modeSettings[mode].label}`;

  const secondHand = document.getElementById("secondHand");
  const duration = Math.min(secondDurations[mode] / 1000, 5);
  secondHand.style.transition = `x2 ${duration}s linear, y2 ${duration}s linear`;

  applyVisualEffects(mode);

  const savedTheme = localStorage.getItem("leetClockTheme");
  if (savedTheme === "dark" || savedTheme === "light") {
    setTheme(savedTheme === "dark");
  } else {
    setTheme(true);
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        updateClock();
      },
      (error) => {
        console.warn("Geolocation error:", error);
      }
    );
  } else {
    console.warn("Geolocation not supported.");
  }

  updateQuote();
  setInterval(updateQuote, 3600000);
  updateClock(); // Set initial digital time
  requestAnimationFrame(runClock); // Start smooth loop

  const savedLat = localStorage.getItem("latitude");
  const savedLon = localStorage.getItem("longitude");
  if (savedLat && savedLon) {
    window.userLocation = {
      latitude: parseFloat(savedLat),
      longitude: parseFloat(savedLon),
    };
    document.getElementById("latInput").value = savedLat;
    document.getElementById("lonInput").value = savedLon;
  }

  document.getElementById("setLocationBtn").addEventListener("click", () => {
    try {
      const lat = parseFloat(document.getElementById("latInput").value);
      const lon = parseFloat(document.getElementById("lonInput").value);
      if (!isNaN(lat) && !isNaN(lon)) {
        window.userLocation = { latitude: lat, longitude: lon };
        localStorage.setItem("latitude", lat);
        localStorage.setItem("longitude", lon);
        updateClock();
      } else {
        alert("Please enter valid coordinates.");
      }
    } catch (error) {
      console.error("Error in setLocationBtn handler:", error);
    }
  });

  document.getElementById("useGeoBtn").addEventListener("click", () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            window.userLocation = { latitude, longitude };
            document.getElementById("latInput").value = latitude.toFixed(4);
            document.getElementById("lonInput").value = longitude.toFixed(4);
            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);
            updateClock();
          },
          (error) => alert("Failed to get location: " + error.message)
        );
      } else {
        alert("Geolocation not supported.");
      }
    } catch (error) {
      console.error("Error in useGeoBtn handler:", error);
    }
  });

  document.getElementById("citySelect").addEventListener("change", (e) => {
    try {
      const val = e.target.value;
      if (val) {
        const [lat, lon] = val.split(",").map(Number);
        document.getElementById("latInput").value = lat;
        document.getElementById("lonInput").value = lon;
        window.userLocation = { latitude: lat, longitude: lon };
        localStorage.setItem("latitude", lat);
        localStorage.setItem("longitude", lon);
        updateClock();
      }
    } catch (error) {
      console.error("Error in citySelect handler:", error);
    }
  });

  document.getElementById("resetLocationBtn").addEventListener("click", () => {
    try {
      window.userLocation = { latitude: 60.1699, longitude: 24.9384 };
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");
      document.getElementById("latInput").value = "";
      document.getElementById("lonInput").value = "";
      document.getElementById("citySelect").value = "";
      updateClock();
    } catch (error) {
      console.error("Error in resetLocationBtn handler:", error);
    }
  });
});
