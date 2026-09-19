/* Home Assistant reports the weather as one of a fixed set of conditions [1].
   This maps each of them onto the Weather Icons font vendored in ui/font [2].

   The mapping has to be written out: the condition names and the icon names
   are unrelated vocabularies, and building a class name out of a condition
   (as an earlier attempt did) silently renders an empty box when the guess is
   wrong. Record<Condition, ...> makes a forgotten condition a tsc error.

   [1] https://developers.home-assistant.io/docs/core/entity/weather/
   [2] https://erikflowers.github.io/weather-icons/ */

export type Condition =
  | "clear-night"
  | "cloudy"
  | "exceptional"
  | "fog"
  | "hail"
  | "lightning"
  | "lightning-rainy"
  | "partlycloudy"
  | "pouring"
  | "rainy"
  | "snowy"
  | "snowy-rainy"
  | "sunny"
  | "windy"
  | "windy-variant";

/* night is only set where the icon actually differs; a condition that reads
   the same by day and by night (rain is rain) just has the one icon. */
const icons: Record<Condition, { day: string; night?: string }> = {
  "clear-night": { day: "wi-night-clear" },
  cloudy: { day: "wi-cloudy" },
  exceptional: { day: "wi-alien" },
  fog: { day: "wi-day-fog", night: "wi-night-fog" },
  hail: { day: "wi-hail" },
  lightning: { day: "wi-lightning" },
  "lightning-rainy": { day: "wi-thunderstorm" },
  partlycloudy: { day: "wi-day-cloudy", night: "wi-night-alt-cloudy" },
  pouring: { day: "wi-rain" },
  rainy: { day: "wi-showers" },
  snowy: { day: "wi-snow" },
  "snowy-rainy": { day: "wi-rain-mix" },
  // met.no reports a clear sky at night as clear-night, but other
  // integrations report sunny around the clock, so this needs a night icon.
  sunny: { day: "wi-day-sunny", night: "wi-night-clear" },
  windy: { day: "wi-strong-wind" },
  "windy-variant": { day: "wi-cloudy-gusts" },
};

export function parseCondition(
  state: string | undefined,
): Condition | undefined {
  // `in` doesn't narrow the key, but the keys of icons are exactly Condition.
  return state !== undefined && state in icons
    ? (state as Condition)
    : undefined;
}

export function weatherIconClass(
  condition: Condition,
  sun: string | undefined,
): string {
  const icon = icons[condition];
  // sun.sun is above_horizon or below_horizon; before the first state arrives
  // it is undefined, and the day icon is the better thing to show.
  return sun === "below_horizon" ? (icon.night ?? icon.day) : icon.day;
}
