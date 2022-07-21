export const toMiliseonds = (date) => {
  const dateInMs = new Date(date);
  return dateInMs.getTime();
};
