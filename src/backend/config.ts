export type BackendConfig = typeof config;

export const config = {
  debug: false,
  host: "https://test.ypfchances.com",
  endpoints: {
    images: "/pages/images/",
    home: "/pages/home.aspx",
    initClock: "/pages/log.ashx",
    content: "/pages/process_tarjeta.ashx",
  },
};

export const debugConfig = {
  ...config,
  debug: true,
  host: "http://localhost:8080",
  endpoints: {
    images: "/public/",
    home: "/pages/home.aspx",
    initClock: "/pages/log.ashx",
    content: "/pages/process_tarjeta.ashx",
  },
};
