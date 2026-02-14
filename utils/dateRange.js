export const getDateRange = (day) => {
  const dayRanges = {
    today: 1,
    yesterday: 2,
    last_seven_days: 7,
    last_fifteenth_days: 15,
    last_thirty_days: 30,
  };
  if (!dayRanges[day]) return null;

  const now = new Date();

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  if (day === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (day === "yesterday") {
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);

    end.setDate(end.getDate() - 1);
  } else {
    start.setDate(start.getDate() - (dayRanges[day] - 1));
    start.setHours(0, 0, 0, 0);
  }

  return { start, end };
};
