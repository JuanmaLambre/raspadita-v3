export const config = {
  debug: false,
  url: "https://test.ypfchances.com",
  endpoints: {
    initClock: "/pages/log.ashx",
    content: "/pages/process_tarjeta.ashx",
  },
};

export const debugConfig = {
  ...config,
  debug: true,
  url: "http://localhost:8080",
  endpoints: {
    initClock: "/pages/log.ashx",
    content: "/pages/process_tarjeta.ashx",
  },
};
