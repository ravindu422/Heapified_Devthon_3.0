// Wrap async controller functions so errors go to error middleware
const asyncHandler = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
