document.addEventListener("DOMContentLoaded", () => {
  let showSeconds = false;
  let timeOffsetNs = 0; // Nanosecond offset for clock sync
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

  const defaultLocation = {
    id: "helsinki",
    name: "Helsinki",
    latitude: 60.1699,
    longitude: 24.9384,
    timeZone: "Europe/Helsinki",
  };

  const cities = [
    defaultLocation,
    {
      id: "stockholm",
      name: "Stockholm",
      latitude: 59.3293,
      longitude: 18.0686,
      timeZone: "Europe/Stockholm",
    },
    {
      id: "berlin",
      name: "Berlin",
      latitude: 52.52,
      longitude: 13.405,
      timeZone: "Europe/Berlin",
    },
    {
      id: "london",
      name: "London",
      latitude: 51.5074,
      longitude: -0.1278,
      timeZone: "Europe/London",
    },
    {
      id: "new-york",
      name: "New York",
      latitude: 40.7128,
      longitude: -74.006,
      timeZone: "America/New_York",
    },
    {
      id: "los-angeles",
      name: "Los Angeles",
      latitude: 34.0522,
      longitude: -118.2437,
      timeZone: "America/Los_Angeles",
    },
    {
      id: "tokyo",
      name: "Tokyo",
      latitude: 35.6895,
      longitude: 139.6917,
      timeZone: "Asia/Tokyo",
    },
    {
      id: "sydney",
      name: "Sydney",
      latitude: -33.8688,
      longitude: 151.2093,
      timeZone: "Australia/Sydney",
    },
    {
      id: "abidjan",
      name: "Abidjan",
      latitude: 5.3453,
      longitude: -4.0244,
      timeZone: "Africa/Abidjan",
    },
    {
      id: "ahmedabad",
      name: "Ahmedabad",
      latitude: 23.0225,
      longitude: 72.5714,
      timeZone: "Asia/Kolkata",
    },
    {
      id: "alexandria",
      name: "Alexandria",
      latitude: 31.2001,
      longitude: 29.9187,
      timeZone: "Africa/Cairo",
    },
    {
      id: "chennai",
      name: "Chennai",
      latitude: 13.0827,
      longitude: 80.2707,
      timeZone: "Asia/Kolkata",
    },
    {
      id: "chengdu",
      name: "Chengdu",
      latitude: 30.5728,
      longitude: 104.0668,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "kolkata",
      name: "Kolkata",
      latitude: 22.5726,
      longitude: 88.3639,
      timeZone: "Asia/Kolkata",
    },
    {
      id: "chittagong",
      name: "Chittagong",
      latitude: 22.3569,
      longitude: 91.7832,
      timeZone: "Asia/Dhaka",
    },
    {
      id: "chongqing",
      name: "Chongqing",
      latitude: 29.4316,
      longitude: 106.9123,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "dar-es-salaam",
      name: "Dar es Salaam",
      latitude: -6.7924,
      longitude: 39.2083,
      timeZone: "Africa/Dar_es_Salaam",
    },
    {
      id: "delhi",
      name: "Delhi",
      latitude: 28.7041,
      longitude: 77.1025,
      timeZone: "Asia/Kolkata",
    },
    {
      id: "dongguan",
      name: "Dongguan",
      latitude: 23.0205,
      longitude: 113.7518,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "addis-ababa",
      name: "Addis Ababa",
      latitude: 9.03,
      longitude: 38.74,
      timeZone: "Africa/Addis_Ababa",
    },
    {
      id: "beijing",
      name: "Beijing",
      latitude: 39.9042,
      longitude: 116.4074,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "belo-horizonte",
      name: "Belo Horizonte",
      latitude: -19.9167,
      longitude: -43.9345,
      timeZone: "America/Sao_Paulo",
    },
    {
      id: "bogota",
      name: "Bogota",
      latitude: 4.711,
      longitude: -74.0721,
      timeZone: "America/Bogota",
    },
    {
      id: "barcelona",
      name: "Barcelona",
      latitude: 41.3851,
      longitude: 2.1734,
      timeZone: "Europe/Madrid",
    },
    {
      id: "buenos-aires",
      name: "Buenos Aires",
      latitude: -34.6037,
      longitude: -58.3816,
      timeZone: "America/Argentina/Buenos_Aires",
    },
    {
      id: "cairo",
      name: "Cairo",
      latitude: 30.0444,
      longitude: 31.2357,
      timeZone: "Africa/Cairo",
    },
    {
      id: "xian",
      name: "Xi'an",
      latitude: 34.3416,
      longitude: 108.9398,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "bangalore",
      name: "Bangalore",
      latitude: 12.9716,
      longitude: 77.5946,
      timeZone: "Asia/Kolkata",
    },
    {
      id: "tianjin",
      name: "Tianjin",
      latitude: 39.3434,
      longitude: 117.3616,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "pune",
      name: "Pune",
      latitude: 18.5204,
      longitude: 73.8567,
      timeZone: "Asia/Kolkata",
    },
    {
      id: "moscow",
      name: "Moscow",
      latitude: 55.7558,
      longitude: 37.6173,
      timeZone: "Europe/Moscow",
    },
    {
      id: "mexico-city",
      name: "Mexico City",
      latitude: 19.4326,
      longitude: -99.1332,
      timeZone: "America/Mexico_City",
    },
    {
      id: "mumbai",
      name: "Mumbai",
      latitude: 19.076,
      longitude: 72.8777,
      timeZone: "Asia/Kolkata",
    },
    {
      id: "seoul",
      name: "Seoul",
      latitude: 37.5665,
      longitude: 126.978,
      timeZone: "Asia/Seoul",
    },
    {
      id: "guangzhou",
      name: "Guangzhou",
      latitude: 23.1291,
      longitude: 113.2644,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "guadalajara",
      name: "Guadalajara",
      latitude: 20.6597,
      longitude: -103.3496,
      timeZone: "America/Mexico_City",
    },
    {
      id: "hangzhou",
      name: "Hangzhou",
      latitude: 30.2741,
      longitude: 120.1551,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "hyderabad",
      name: "Hyderabad",
      latitude: 17.385,
      longitude: 78.4867,
      timeZone: "Asia/Kolkata",
    },
    {
      id: "bangkok",
      name: "Bangkok",
      latitude: 13.7563,
      longitude: 100.5018,
      timeZone: "Asia/Bangkok",
    },
    {
      id: "jakarta",
      name: "Jakarta",
      latitude: -6.2088,
      longitude: 106.8456,
      timeZone: "Asia/Jakarta",
    },
    {
      id: "qingdao",
      name: "Qingdao",
      latitude: 36.0662,
      longitude: 120.3826,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "lagos",
      name: "Lagos",
      latitude: 6.5244,
      longitude: 3.3792,
      timeZone: "Africa/Lagos",
    },
    {
      id: "osaka",
      name: "Osaka",
      latitude: 34.6937,
      longitude: 135.5023,
      timeZone: "Asia/Tokyo",
    },
    {
      id: "santiago",
      name: "Santiago",
      latitude: -33.4489,
      longitude: -70.6693,
      timeZone: "America/Santiago",
    },
    {
      id: "sao-paulo",
      name: "Sao Paulo",
      latitude: -23.5505,
      longitude: -46.6333,
      timeZone: "America/Sao_Paulo",
    },
    {
      id: "karachi",
      name: "Karachi",
      latitude: 24.8607,
      longitude: 67.0011,
      timeZone: "Asia/Karachi",
    },
    {
      id: "riyadh",
      name: "Riyadh",
      latitude: 24.7136,
      longitude: 46.6753,
      timeZone: "Asia/Riyadh",
    },
    {
      id: "hong-kong",
      name: "Hong Kong",
      latitude: 22.3193,
      longitude: 114.1694,
      timeZone: "Asia/Hong_Kong",
    },
    {
      id: "foshan",
      name: "Foshan",
      latitude: 23.0215,
      longitude: 113.749,
      timeZone: "Asia/Shanghai",
    },
    {
      id: "surat",
      name: "Surat",
      latitude: 21.1702,
      longitude: 72.8311,
      timeZone: "Asia/Kolkata",
    },
    {
      id: "tehran",
      name: "Tehran",
      latitude: 35.6892,
      longitude: 51.389,
      timeZone: "Asia/Tehran",
    },
    {
      id: "ho-chi-minh-city",
      name: "Ho Chi Minh City",
      latitude: 10.7769,
      longitude: 106.7009,
      timeZone: "Asia/Ho_Chi_Minh",
    },
  ];

  const labelGroup = document.getElementById("labels");
  const SATA_CYCLE_SECONDS = 100 * 100 * 100;
  const EARTH_DAY_SECONDS = 86400;
  const MARTIAN_DAY_SECONDS = 88775;
  const clockFace = document.querySelector("svg circle[stroke='lime']");
  const centerDot = document.querySelector("svg circle[fill='lime']");
  const digitalDisplay = document.getElementById("digital");
  const handElements = {
    hour: document.getElementById("hourHand"),
    minute: document.getElementById("minuteHand"),
    second: document.getElementById("secondHand"),
  };
  let lastDigitalText = "";
  let lastDisplaySecond = null;
  let lastAppliedMode = "";
  let civilFormatterTimeZone = "";
  let civilFormatter = null;

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
          "text",
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
          "text",
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

  function getSelectedInstantMs() {
    return Date.now() + timeOffsetNs / 1e6;
  }

  function getCivilParts(instantMs = getSelectedInstantMs()) {
    const date = new Date(instantMs);
    const timeZone = window.userLocation?.timeZone;

    if (!timeZone) {
      return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        milliseconds: date.getMilliseconds(),
      };
    }

    if (timeZone !== civilFormatterTimeZone) {
      civilFormatterTimeZone = timeZone;
      civilFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    const parts = Object.fromEntries(
      civilFormatter.formatToParts(date).map((part) => [part.type, part.value]),
    );
    const hours = Number(parts.hour) % 24;

    return {
      hours,
      minutes: Number(parts.minute),
      seconds: Number(parts.second),
      milliseconds: date.getMilliseconds(),
    };
  }

  function getCivilSecondsSinceMidnight(instantMs = getSelectedInstantMs()) {
    const parts = getCivilParts(instantMs);
    return (
      parts.hours * 3600 +
      parts.minutes * 60 +
      parts.seconds +
      parts.milliseconds / 1000
    );
  }

  function getLocation() {
    return window.userLocation || defaultLocation;
  }

  function getModeTime() {
    const settings = modeSettings[mode];
    const nowMs = getSelectedInstantMs();
    const civilParts = getCivilParts(nowMs);
    const earthSeconds = getCivilSecondsSinceMidnight(nowMs);
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
      const { latitude, longitude } = getLocation();
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
        (elapsed % relativeHourLength) / (relativeHourLength / 60),
      );
      seconds = Math.floor(
        (elapsed % (relativeHourLength / 60)) / (relativeHourLength / 3600),
      );
      fraction =
        (elapsed % (relativeHourLength / 3600)) / (relativeHourLength / 3600);
      displaySeconds = Math.round(seconds + fraction) % 60;
    } else if (mode === "real") {
      hours = civilParts.hours % 12 || 12;
      minutes = civilParts.minutes;
      seconds = civilParts.seconds;
      fraction = civilParts.milliseconds / 1000;
      displaySeconds = seconds;
    } else if (mode === "real24") {
      hours = civilParts.hours;
      minutes = civilParts.minutes;
      seconds = civilParts.seconds;
      fraction = civilParts.milliseconds / 1000;
      displaySeconds = seconds;
    } else if (mode === "martian") {
      const martianSeconds =
        earthSeconds * (EARTH_DAY_SECONDS / MARTIAN_DAY_SECONDS);
      hours = Math.floor(martianSeconds / 3600) % 24;
      minutes = Math.floor((martianSeconds % 3600) / 60);
      seconds = Math.floor(martianSeconds % 60);
      fraction = martianSeconds % 1;
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

  function initializeClockGeometry() {
    handElements.minute.setAttribute("stroke-width", (0.75 / 100) * 400);
    handElements.hour.setAttribute("stroke-width", (1.5 / 100) * 400);
    handElements.second.setAttribute("stroke-width", (0.25 / 100) * 400);
    clockFace.setAttribute("stroke-width", (1 / 100) * 400);
    centerDot.setAttribute("r", (2.5 / 100) * 400);
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

    setHand(handElements.second, secondAngle, 45);
    setHand(handElements.minute, minuteAngle, 39);
    setHand(handElements.hour, hourAngle, 25);
  }

  function setHand(hand, angleDeg, lengthPercentage) {
    const length = (lengthPercentage / 100) * 400;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const x2 = centerX + length * Math.cos(angleRad);
    const y2 = centerY + length * Math.sin(angleRad);
    if (!hand) {
      console.error("Clock hand element not found");
      return;
    }
    hand.setAttribute("x2", x2);
    hand.setAttribute("y2", y2);
  }

  function updateClock(time = null) {
    try {
      if (!time) time = getModeTime();
      const civilParts = getCivilParts();
      const realHours = civilParts.hours;
      const realMinutes = civilParts.minutes;
      const realSeconds = civilParts.seconds;

      updateClockHands(time);

      const settings = modeSettings[mode];
      const toHex = (num) =>
        mode === "hex" ? num.toString(16).toUpperCase() : num.toString();
      const digitalText = `${
        settings.label
      }: ${toHex(time.hours).padStart(2, "0")}:${toHex(time.minutes).padStart(
        2,
        "0",
      )}${
        showSeconds ? `:${toHex(time.displaySeconds).padStart(2, "0")}` : ""
      }${
        (mode === "real" || mode === "relative") && !showSeconds
          ? realHours >= 12
            ? " PM"
            : " AM"
          : ""
      }`;

      if (digitalText !== lastDigitalText) {
        digitalDisplay.textContent = digitalText;
        lastDigitalText = digitalText;
      }

      const displaySecondKey = `${mode}:${time.displaySeconds}`;
      if (
        realHours === 13 &&
        realMinutes === 37 &&
        realSeconds === 0 &&
        displaySecondKey !== lastDisplaySecond
      ) {
        const sound = document.getElementById("sound");
        if (!sound.src) {
          sound.src = "leet.wav";
        }
        sound.play().catch((error) => {
          console.warn("Unable to play achievement sound:", error);
        });
        document.getElementById("quote").textContent =
          "13:37 Achieved! Stay leet.";
      }
      lastDisplaySecond = displaySecondKey;

      if (mode !== lastAppliedMode) {
        applyVisualEffects(mode);
        lastAppliedMode = mode;
      }
    } catch (error) {
      console.error("Error in updateClock:", error);
    }
  }

  function runClock() {
    const time = getModeTime();
    updateClock(time);

    // Check if offset or location changed and force refresh if needed
    const currentLat = window.userLocation?.latitude || 0;
    const currentLon = window.userLocation?.longitude || 0;
    const currentTimeZone = window.userLocation?.timeZone || "";
    if (
      timeOffsetNs !== runClock.lastOffset ||
      currentLat !== runClock.lastLat ||
      currentLon !== runClock.lastLon ||
      currentTimeZone !== runClock.lastTimeZone
    ) {
      runClock.lastOffset = timeOffsetNs;
      runClock.lastLat = currentLat;
      runClock.lastLon = currentLon;
      runClock.lastTimeZone = currentTimeZone;
    }

    requestAnimationFrame(runClock);
  }
  runClock.lastOffset = 0;
  runClock.lastLat = 0;
  runClock.lastLon = 0;
  runClock.lastTimeZone = "";

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
        isDark ? "lime" : "var(--text-color-light-mode)",
      );
      root.style.setProperty(
        "--panel-bg",
        isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.75)",
      );
      root.style.setProperty(
        "--glow-color",
        isDark ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 130, 0, 0.14)",
      );
      root.style.setProperty(
        "--clock-face-bg",
        isDark ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)",
      );
      root.style.setProperty(
        "--clock-face-mid",
        isDark ? "rgba(0, 255, 0, 0.1)" : "rgba(0, 130, 0, 0.08)",
      );
      root.style.setProperty(
        "--clock-face-edge",
        isDark ? "rgba(0, 255, 0, 0.06)" : "rgba(0, 130, 0, 0.05)",
      );
      root.style.setProperty(
        "--background-edge",
        isDark ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)",
      );
      localStorage.setItem("leetClockTheme", isDark ? "dark" : "light");
    } catch (error) {
      console.error("Error in setTheme:", error);
    }
  }

  function populateCitySelect() {
    const citySelect = document.getElementById("citySelect");
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.id;
      option.textContent = `${city.name} (${city.timeZone})`;
      citySelect.appendChild(option);
    });
  }

  function setLocation(location, persist = true) {
    window.userLocation = location;
    civilFormatterTimeZone = "";
    civilFormatter = null;
    document.getElementById("latInput").value = location.latitude;
    document.getElementById("lonInput").value = location.longitude;
    document.getElementById("citySelect").value = location.id || "";

    if (!persist) return;

    localStorage.setItem("latitude", location.latitude);
    localStorage.setItem("longitude", location.longitude);
    if (location.id) {
      localStorage.setItem("cityId", location.id);
    } else {
      localStorage.removeItem("cityId");
    }
    if (location.timeZone) {
      localStorage.setItem("timeZone", location.timeZone);
    } else {
      localStorage.removeItem("timeZone");
    }
    localStorage.removeItem("utcOffset");
  }

  function loadSavedLocation() {
    const savedCityId = localStorage.getItem("cityId");
    const savedCity = cities.find((city) => city.id === savedCityId);

    if (savedCity) {
      setLocation(savedCity, false);
      return;
    }

    const savedLat = localStorage.getItem("latitude");
    const savedLon = localStorage.getItem("longitude");
    const savedTimeZone = localStorage.getItem("timeZone");

    if (savedLat && savedLon) {
      const lat = parseFloat(savedLat);
      const lon = parseFloat(savedLon);
      const matchingCity = cities.find(
        (city) =>
          Math.abs(city.latitude - lat) < 0.0001 &&
          Math.abs(city.longitude - lon) < 0.0001,
      );

      if (matchingCity) {
        setLocation(matchingCity, false);
        return;
      }

      setLocation(
        {
          latitude: lat,
          longitude: lon,
          timeZone: savedTimeZone || undefined,
        },
        false,
      );
      return;
    }

    setLocation(defaultLocation, false);
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
      document.getElementById("toggleMode").textContent =
        `Mode: ${modeSettings[mode].label}`;
      applyVisualEffects(mode);
      lastAppliedMode = mode;

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
  document.getElementById("toggleMode").textContent =
    `Mode: ${modeSettings[mode].label}`;

  initializeClockGeometry();
  applyVisualEffects(mode);
  lastAppliedMode = mode;

  const savedSync = localStorage.getItem("leetClockSync");
  if (savedSync) {
    const parsed = parseInt(savedSync, 10);
    if (!isNaN(parsed)) {
      timeOffsetNs = parsed;
      document.getElementById("syncInput").value = parsed;
    }
  }

  const savedTheme = localStorage.getItem("leetClockTheme");
  if (savedTheme === "dark" || savedTheme === "light") {
    setTheme(savedTheme === "dark");
  } else {
    setTheme(true);
  }

  populateCitySelect();
  loadSavedLocation();

  updateQuote();
  setInterval(updateQuote, 3600000);
  updateClock(); // Set initial digital time
  requestAnimationFrame(runClock); // Start smooth loop

  document.getElementById("setLocationBtn").addEventListener("click", () => {
    try {
      const lat = parseFloat(document.getElementById("latInput").value);
      const lon = parseFloat(document.getElementById("lonInput").value);
      if (!isNaN(lat) && !isNaN(lon)) {
        setLocation({
          latitude: lat,
          longitude: lon,
        });
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
            setLocation({
              latitude: Number(latitude.toFixed(4)),
              longitude: Number(longitude.toFixed(4)),
            });
            updateClock();
          },
          (error) => alert("Failed to get location: " + error.message),
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
        const city = cities.find((item) => item.id === val);
        if (!city) return;
        setLocation(city);
        updateClock();
      }
    } catch (error) {
      console.error("Error in citySelect handler:", error);
    }
  });

  document.getElementById("resetLocationBtn").addEventListener("click", () => {
    try {
      setLocation(defaultLocation);
      updateClock();
    } catch (error) {
      console.error("Error in resetLocationBtn handler:", error);
    }
  });

  document.getElementById("applySyncBtn").addEventListener("click", () => {
    try {
      applyTimeSync();
    } catch (error) {
      console.error("Error in applySyncBtn handler:", error);
    }
  });

  document.getElementById("syncInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      try {
        applyTimeSync();
      } catch (error) {
        console.error("Error in syncInput handler:", error);
      }
    }
  });

  function applyTimeSync() {
    const syncInput = document.getElementById("syncInput");
    const value = parseInt(syncInput.value, 10);
    if (!isNaN(value)) {
      timeOffsetNs = value;
      localStorage.setItem("leetClockSync", value.toString());
      updateClock();
    }
  }
});
