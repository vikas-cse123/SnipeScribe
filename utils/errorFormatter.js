export const formatValidationError = (error) => {
  const formattedErr = [];
  const keys = Object.keys(error.errors);
  for (const key of keys) {
    const obj = {};
    const { message, kind } = error.errors[key];
    obj.field = key;
    obj.message = message;
    obj.type = kind;
    formattedErr.push(obj);
  }
  return formattedErr;
};
