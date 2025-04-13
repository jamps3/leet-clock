document.addEventListener("DOMContentLoaded", () => {
  let showSeconds = false;
  const centerX = 200;
  const centerY = 200;
  let mode = "leet";

  const modeSettings = {
    leet: {
      hours: 13,
      minutes: 37,
      label: "Leet time",
      offset: 13 * 3600 + 37 * 60,
      hourFont: 24,
      minuteFont: 12,
    },
    real: {
      hours: 12,
      minutes: 60,
      label: "Real time 12h",
      hourFont: 24,
      minuteFont: 12,
    },
    real24: {
      hours: 24,
      minutes: 60,
      label: "Real time 24h",
      hourFont: 24,
      minuteFont: 12,
    },
    sata: {
      hours: 100,
      minutes: 100,
      label: "Sata time",
      hourFont: 6,
      minuteFont: 8,
    },
    relative: {
      hours: 12,
      minutes: 60,
      label: "Relative Hour",
      hourFont: 24,
      minuteFont: 12,
    },
    binary: {
      hours: 16,
      minutes: 64,
      label: "Binary time",
      hourFont: 24,
      minuteFont: 12,
    },
    martian: {
      hours: 24,
      minutes: 60,
      label: "Martian time",
      hourFont: 24,
      minuteFont: 12,
    },
    hex: {
      hours: 16,
      minutes: 16,
      label: "Hex time",
      hourFont: 24,
      minuteFont: 12,
    },
  };

  const labelGroup = document.getElementById("labels");

  function drawLabels(hourCount, minuteCount) {
    try {
      labelGroup.innerHTML = "";
      const hourRadius = 160;
      const minuteRadius = 140;
      const settings = modeSettings[mode];
      const isHexMode = mode === "hex";

      const toHexLabel = (num) =>
        isHexMode ? num.toString(16).toUpperCase() : num.toString();

      for (let i = 0; i < hourCount; i++) {
        const angle = ((360 / hourCount) * i - 90) * (Math.PI / 180);
        const x = centerX + (hourRadius / 100) * 100 * Math.cos(angle);
        const y = centerY + (hourRadius / 100) * 100 * Math.sin(angle);
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
        const x = centerX + (minuteRadius / 100) * 100 * Math.cos(angle);
        const y = centerY + (minuteRadius / 100) * 100 * Math.sin(angle);
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

  function getSunriseTime(date) {
    try {
      const times = SunCalc.getTimes(date, latitude, longitude);
      return times.sunrise;
    } catch (error) {
      console.error("Error in getSunriseTime:", error);
      return null;
    }
  }

  function getSunsetTime(date) {
    try {
      const times = SunCalc.getTimes(date, latitude, longitude);
      return times.sunset;
    } catch (error) {
      console.error("Error in getSunsetTime:", error);
      return null;
    }
  }

  function updateClock() {
    try {
      const now = new Date();
      const realHours = now.getHours();
      const realMinutes = now.getMinutes();
      const realSeconds = now.getSeconds();
      const realMilliseconds = now.getMilliseconds();

      const nowInSeconds =
        realHours * 3600 +
        realMinutes * 60 +
        realSeconds +
        realMilliseconds / 1000;

      let customHour, customMinute, customSecond;
      const settings = modeSettings[mode];

      if (mode === "relative") {
        let latitude, longitude;
        if (window.userLocation) {
          ({ latitude, longitude } = window.userLocation);
        } else {
          latitude = 60.1699;
          longitude = 24.9384;
        }

        const times = SunCalc.getTimes(now, latitude, longitude);
        const sunrise = times.sunrise.getTime();
        const sunset = times.sunset.getTime();
        const nowMs = now.getTime();

        const msInDay = 24 * 60 * 60 * 1000;
        let isDaytime = nowMs >= sunrise && nowMs < sunset;

        let periodStart = isDaytime ? sunrise : sunset;
        let periodEnd = isDaytime ? sunset : sunrise + msInDay;
        let periodLength = periodEnd - periodStart;
        let elapsed = (nowMs - periodStart + msInDay) % msInDay;

        let relativeHourLength = periodLength / 12;
        customHour = Math.floor(elapsed / relativeHourLength);
        customMinute = Math.floor(
          (elapsed % relativeHourLength) / (relativeHourLength / 60)
        );
        customSecond = Math.floor(
          (elapsed % (relativeHourLength / 60)) / (relativeHourLength / 3600)
        );
      } else if (mode === "real") {
        customHour = realHours % 12;
        if (customHour === 0) customHour = 12;
        customMinute = realMinutes;
        customSecond = realSeconds;
      } else if (mode === "real24") {
        customHour = realHours;
        customMinute = realMinutes;
        customSecond = realSeconds;
      } else if (mode === "martian") {
        const secondsInEarthDay = 24 * 60 * 60;
        const secondsInMartianDay = 88775;
        const fractionOfEarthDay = nowInSeconds / secondsInEarthDay;
        const martianSeconds = fractionOfEarthDay * secondsInMartianDay;

        const hourCount = settings.hours;
        const minuteCount = settings.minutes;
        const secondCount = 60;
        const totalMartianSeconds = hourCount * minuteCount * secondCount;

        const totalMinutes = martianSeconds / (secondCount * minuteCount);
        customHour = Math.floor(totalMinutes / minuteCount) % hourCount;
        customMinute = Math.floor(totalMinutes % minuteCount);
        customSecond = Math.floor(
          (martianSeconds % (secondCount * minuteCount)) / secondCount
        );
      } else {
        const secondsInDay = 24 * 60 * 60;
        const offset = settings.offset || 0;
        const adjustedSeconds =
          (nowInSeconds - offset + secondsInDay) % secondsInDay;
        const fractionOfDay = adjustedSeconds / secondsInDay;

        const hourCount = settings.hours;
        const minuteCount = settings.minutes;
        const secondCount =
          mode === "sata"
            ? 100
            : mode === "leet"
            ? 37
            : mode === "binary"
            ? 64
            : mode === "hex"
            ? 16
            : 60;
        const totalCustomSeconds = hourCount * minuteCount * secondCount;

        const totalMinutes = fractionOfDay * (hourCount * minuteCount);
        customHour = Math.floor(totalMinutes / minuteCount) % hourCount;
        customMinute = Math.floor(totalMinutes % minuteCount);
        const totalSeconds = fractionOfDay * totalCustomSeconds;
        customSecond = Math.floor(totalSeconds % secondCount);
      }

      let minuteAngle, hourAngle, secondAngle;
      if (mode === "relative") {
        minuteAngle = (customMinute / 60) * 360;
        hourAngle = ((customHour + customMinute / 60) / 12) * 360;
        secondAngle = (customSecond / 60) * 360;
      } else {
        const hourCount = settings.hours;
        const minuteCount = settings.minutes;
        const secondCount =
          mode === "sata"
            ? 100
            : mode === "leet"
            ? 37
            : mode === "binary"
            ? 64
            : mode === "hex"
            ? 16
            : 60;
        minuteAngle = (customMinute / minuteCount) * 360;
        hourAngle =
          ((customHour + customMinute / minuteCount) / hourCount) * 360;
        secondAngle = (customSecond / secondCount) * 360;
      }

      const setHand = (id, angleDeg, lengthPercentage) => {
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
      };

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

      setHand("minuteHand", minuteAngle, 37.5);
      setHand("hourHand", hourAngle, 25);
      setHand("secondHand", secondAngle, 42.5);

      const toHex = (num) =>
        mode === "hex" ? num.toString(16).toUpperCase() : num.toString();
      document.getElementById("digital").textContent = `${
        settings.label
      }: ${toHex(customHour).padStart(2, "0")}:${toHex(customMinute).padStart(
        2,
        "0"
      )}${showSeconds ? `:${toHex(customSecond).padStart(2, "0")}` : ""}${
        (mode === "real" || mode === "relative") && !showSeconds
          ? realHours >= 12
            ? " PM"
            : " AM"
          : ""
      }`;

      if (realHours === 13 && realMinutes === 37 && realSeconds === 0) {
        const sound = document.getElementById("sound");
        if (!sound.src) {
          sound.src = "https://www.soundjay.com/button/beep-07.wav";
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

  // Add console.log to debug event listeners
  document.getElementById("toggleTheme").addEventListener("click", () => {
    console.log("Toggle Theme button clicked");
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
    console.log("Toggle Mode button clicked");
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
      updateClock();
    } catch (error) {
      console.error("Error in toggleMode handler:", error);
    }
  });

  document.getElementById("toggleSeconds").addEventListener("click", () => {
    console.log("Toggle Seconds button clicked");
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

  // Ensure #startup doesn't block clicks after animation
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
  setInterval(updateClock, 100);
  updateClock();

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

  // Add minimal event listeners for debugging
  document.getElementById("toggleTheme").addEventListener("click", () => {
    console.log("Minimal Toggle Theme button clicked");
  });

  document.getElementById("toggleMode").addEventListener("click", () => {
    console.log("Minimal Toggle Mode button clicked");
  });

  document.getElementById("toggleSeconds").addEventListener("click", () => {
    console.log("Minimal Toggle Seconds button clicked");
  });

  document.body.addEventListener("click", (event) => {
    console.log("Body clicked, target:", event.target);
  });
});
