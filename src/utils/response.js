const DEVELOPER_CREDIT = "t.me/q_sra - yun";

export const apiResponse = {
  success: (data, meta = {}) => ({
    developer: DEVELOPER_CREDIT,
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  }),
  error: (code, message, details = null) => ({
    developer: DEVELOPER_CREDIT,
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  }),
  paginated: (data, page, size, hasMore) => ({
    developer: DEVELOPER_CREDIT,
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        hasMore,
      },
    },
  }),
};
