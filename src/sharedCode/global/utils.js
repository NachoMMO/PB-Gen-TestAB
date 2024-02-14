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

export default {
  parseMetrics
}
