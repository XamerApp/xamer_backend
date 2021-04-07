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

const time_left_in_min = (end_time) => {
  const current = new Date().getTime();
  const end = end_time.getTime();
  const left = end - current;
  if (left <= 0) return 0;
  return left / (1000 * 60);
};

const time_left_in_second = (end_time) => {
  const current = new Date().getTime();
  const end = end_time.getTime();
  const left = end - current;
  if (left <= 0) return 0;
  return left / 1000;
};

const time_left_in_hour = (end_time) => {
  const current = new Date().getTime();
  const end = end_time.getTime();
  const left = end - current;
  if (left <= 0) return 0;
  return left / (1000 * 3600);
};

const is_eligible_to_create_test = (start_time, offset) => {
  const current = new Date();
  const start = start_time.getTime();
  const offset_in_ms = offset * 3600000;

  // We cannnot create a test which will be taken after 9 mins from the start offset
  // because thats not propertime for creating test
  const constantOffset = 600000; // 10 mins in ms

  const restrict = start - offset_in_ms - constantOffset;
  if (restrict <= 0) return false;
  return current.getTime() < restrict ? true : false;
};

const is_eligible_to_start_exam = (start_time, full_time, offset) => {
  const start = start_time.getTime() - offset * 3600000;
  const end = start_time.getTime() + full_time * 60000;
  const current = new Date().getTime();
  return current > start && current < end ? true : false;
};

module.exports = {
  is_eligible_by_hour,
  is_eligible_by_min,
  time_left_in_hour,
  time_left_in_min,
  time_left_in_second,
  is_eligible_to_create_test,
  is_eligible_to_start_exam,
};
