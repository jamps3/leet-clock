# leet-clock

Leet Clock is a browser-based 1337 clock with multiple time systems, animated
SVG hands, city selection, custom coordinates, geolocation, theme switching, and
nanosecond sync adjustment.

## Modes

- Leet time
- Real time, 12-hour and 24-hour
- Sata time
- Relative solar hour, based on sunrise and sunset for the selected location
- Binary time
- Martian time
- Hex time

## Location And Timezones

City selections use IANA timezone names through `Intl.DateTimeFormat`, so cities
with daylight saving time follow the browser's timezone database instead of a
hard-coded UTC offset. Custom coordinates and geolocation use the browser's local
civil time for the clock display and the coordinates for solar calculations.

## Verification

Run a syntax check:

```sh
node --check script.js
```

The app is static, so it can be opened directly from `index.html`.

## Screenshot

![Screenshot of the Leet Clock](screenshot.png)
