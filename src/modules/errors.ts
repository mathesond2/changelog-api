export const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((e) => {
      console.error(`error: ${e.message}`);
      next(e);
    });
  };
};
