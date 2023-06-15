/* eslint-disable linebreak-style */
const successResponse = (h, message, data, statusCode = 200) => {
  const response = {
    status: 'success',
    message,
    data,
  };

  return h.response(response).code(statusCode);
};

const errorResponse = (h, message, statusCode = 500) => {
  const response = {
    status: 'fail',
    message,
  };

  return h.response(response).code(statusCode);
};

module.exports = {
  successResponse,
  errorResponse,
};
