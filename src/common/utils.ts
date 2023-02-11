// eslint-disable-next-line @typescript-eslint/ban-types
export const partialize = <T extends Object>(obj: T): T => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });

  return obj;
};
