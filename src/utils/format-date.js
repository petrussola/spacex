export function formatDate(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function formatDateTime(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  }).format(new Date(timestamp));
}

export function transformAmPm(timestamp) {
  const hourArray = timestamp.split(":");
  let newHourArray = hourArray.map((item, i) => {
    return i === 0 && item > 12 ? (item - 12).toString() : item.toString();
  }); // transforms hour component of time stamp into AM/PM format
  return [
    `${newHourArray[0].toString().padStart(2, "0")}:${newHourArray[1]}:${
      newHourArray[2]
    }`,
    `${parseInt(hourArray[0], 10) > 11 ? "PM" : "AM"}`,
  ];
}

export function checkDayPadTime(rawDate, formatedDate) {
  const dayRaw = rawDate.split("T")[0].split("-")[2]; // extracts day from local time stamp returned by api
  const dayFormatted = formatedDate.split(" "); // extract the day created in UTC by formatDateTime function above
  return dayRaw === dayFormatted[1]
    ? formatedDate
    : `${dayFormatted[0]} ${dayRaw}`;
} // if utc and launch pad day is the same, return formated date. otherwise, return month and day extracted from launch pad api response
