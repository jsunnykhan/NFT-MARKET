const toSeconds = (date: string) => {
  const dateInSeconds = new Date(date);
  return dateInSeconds.getTime() / 1000;
};

const toMiliseonds = (date: string) => {
  const dateInMs = new Date(date);
  return dateInMs.getTime();
};

export { toSeconds, toMiliseonds };
