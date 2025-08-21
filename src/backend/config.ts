export type BackendConfig = typeof config;

export const config = {
  debug: false,
  endpoints: {
    images: "/pages/images/",
    home: "/pages/home.aspx",
    initClock: "/pages/log.ashx",
    content: "/pages/process_tarjeta.ashx",
    winExit: "/pages/tarjeta_salida.aspx",
  },
};

export const debugConfig = {
  ...config,
  debug: true,
  endpoints: {
    images: "/public/images/",
    home: "/pages/home.aspx",
    initClock: "/pages/log.ashx",
    content: "/pages/process_tarjeta.ashx",
    winExit: "/pages/tarjeta_salida.aspx",
  },
};
