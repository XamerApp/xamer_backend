const is_eligible_by_min = (start_date, full_time) => {
  const current = new Date();
  const start = start_date.getTime();
  const end = start + full_time * 60 * 1000;
  console.log(new Date(end).toString());
  return current > start && current < end ? true : false;
};

const is_eligible_by_hour = (start_date, full_time) => {
  const current = new Date();
  const start = start_date.getTime();
  const end = start + full_time * 3600 * 1000;
  console.log(new Date(end).toString());
  return current > start && current < end ? true : false;
};

module.exports = {
  is_eligible_by_hour,
  is_eligible_by_min,
};
