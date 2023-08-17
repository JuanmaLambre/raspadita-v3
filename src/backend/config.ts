export const config = {
  url: "https://test.ypfchances.com",
  endpoints: {
    initClock: "/pages/log.ashx",
    content: "/pages/process_tarjeta.ashx",
  },
};

export const debugConfig = {
  ...config,
  endpoints: {
    initClock: "/log",
    content: "/content",
  },
};
