/**
 * Se encarga de recibir las métricas en el formato del json de entrada
 * y devolver un objeto con las métricas como keys, para poder ser usadas
 * a lo largo del script.
 *
 * @param {Array} metrics - Métricas en formato de array de objetos.
 *
 * @returns {Object} - Objeto con las métricas como keys.
 */
function parseMetrics(metrics) {
  const parsedMetrics = {};

  metrics.forEach(key => {
    parsedMetrics[key] = key;
  });

  return parsedMetrics;
}

/**
 * Se encarga de recibir una key y devolver el valor que se encuentra
 * en el sessionStorage.
 *
 * @param {String} key - Clave para buscar en el sessionStorage.
 *
 * @returns {Object} - Valor que se encuentra en el sessionStorage.
 */
function getFromSS (key) {
  return JSON.parse(sessionStorage.getItem(key));
}

export {
  getFromSS,
  parseMetrics
}
