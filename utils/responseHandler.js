export const sendResponse = (res, status, statusCode, data) => {
  return res.status(200).json({
    status,
    statusCode,
    data,
  });
};
