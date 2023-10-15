export function formatDateToTime(date) {
  if (!date) {
    return "";
  }

  const now = new Date();
  const diffInMilliseconds = now - date;
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 30) {
    // If the date is a month or more old, format it as "dd/mm/yyyy"
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  } else if (days >= 1) {
    return `${days}d`;
  } else if (hours >= 1) {
    return `${hours}h`;
  } else if (minutes >= 1) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}
