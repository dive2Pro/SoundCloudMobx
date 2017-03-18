
export function seconds2time(seconds: number): string {
  let days = Math.floor(seconds / (3600 * 24));
  const delDaysSeconds = (days * (3600 * 24))
  let hours = Math.floor((seconds - delDaysSeconds) / 3600);

  let minutes = Math.floor((seconds - (hours * 3600) - delDaysSeconds) / 60);
  let nowSeconds = seconds - delDaysSeconds - (hours * 3600) - (minutes * 60);
  let time = "";
  if (days != 0) {
    time = days + ":"
  }
  if (hours != 0) {
    time = hours + ":";
  }
  let cacuMinutes = ""
  if (minutes != 0 || time !== "") {
    cacuMinutes = (minutes < 10 && time !== "") ? "0" + minutes : String(minutes);
    time += cacuMinutes + ":";
  }
  if (time === "") {
    time = nowSeconds + "s";
  }
  else {
    time += (nowSeconds < 10) ? "0" + nowSeconds : String(nowSeconds);
  }
  return time;
}