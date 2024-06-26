import TimeAgo from "javascript-time-ago";
// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

const getHumanDiff = (date) => {
  return timeAgo.format(date, "round");
};

export default getHumanDiff;
