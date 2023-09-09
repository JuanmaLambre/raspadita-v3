export const selectors = {
  background: {
    class: ".fondo-main-juego",
    lostClass: ".fondo-main-perdedor",
  },

  cards: {
    image: "img-juego",
  },

  clock: {
    section: "#section_Inicio",
    timeBar: ".contenedor-temporizador .time",
  },

  messages: {
    timeout: "#section_TiempoFuera",
    lost: "#section_Perdiste",
    usedCode: "#section_YaUtilizadaNoGano",

    popup: {
      element: "#mensaje-emergente",
      text: "#txt_titulo",
      accept: ".btn-aceptar",
    },
  },
};
