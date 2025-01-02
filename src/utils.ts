import dayjs from "dayjs";

// Create human readable date like "21:00 tomorrow"
function humanReadableDate(d: Date | string): string {
  const eventDate = dayjs(d);
  const now = dayjs();
  const tonight = now.endOf("day");
  const tomorrow = tonight.add(1, "day");
  const oneWeekFromNow = now.add(1, "week").endOf("day");

  if (eventDate.isBefore(tonight)) {
    return eventDate.format("H:mm");
  } else if (eventDate.isBefore(tomorrow)) {
    return eventDate.format("H:mm") + " tomorrow";
  } else if (eventDate.isBefore(oneWeekFromNow)) {
    return eventDate.format("H:mm on ddd");
  } else {
    return eventDate.format("ddd MMM D");
  }
}

export { humanReadableDate };
