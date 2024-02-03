window["optimizely"] = window["optimizely"] || [];

var experimentCode = '2219612';

var metrics = {
  cestas_arrastradas_buscador: 'cestas_arrastradas_buscador',
  cestas_arrastradas_personalizacion: 'cestas_arrastradas_pers',
  clicks_elementos_personalizacion: 'clicks_elementos_pers',
  clicks_productos_buscador: 'clicks_productos_buscador',
  ventas: 'ventas',
  ventas_euros: 'ventas_euros',
  visitas: 'visitas',
  visitantes_unicos: 'visitantes_unicos',
};

function getMetricName(metric) {
  return metrics[metric] + '_' + experimentCode;
}

function pushAttrsToOptimizely(eventType, attrs) {
  window["optimizely"].push({
    type: eventType,
    attributes: attrs
  });
}

function pushEventToOptimizely(eventName, tags) {
  window["optimizely"].push({
    type: "event",
    eventName: eventName,
    tags: tags
  });
}

function optiTrackSegmentationISO() {
  var attrs = {
    'sgm_pais': inditex.iCountryCode
  }
  pushAttrsToOptimizely('user', attrs);
}

function getFromSS (key) {
  return JSON.parse(sessionStorage.getItem(key));
}

function optiConfirmationRevenue(experimentCookieId) {
  if (inditex.readCookie("optyVisitExperiment" + experimentCookieId) === '1') {
    var productsCookie = inditex.readCookie('optiProductsSku' + experimentCode);
    var productsCookieValues = JSON.parse(productsCookie);

    if(!productsCookieValues) {
      return;
    }

    var optiTrackRevenue = setInterval(function () {
      if (!inditex.iXOrderOrderSummaryJSON || !inditex.iXOrderOrderSummaryJSON.totalOrderEuro) {
        return;
      }

      clearInterval(optiTrackRevenue);

      var totalRevenue = 0;
      inditex.iXOrderOrderSummaryJSON.items.forEach(item => {
        if (productsCookieValues.indexOf(item.sku) !== -1) {
          var unitPriceEuro = item.unitPriceEuro;
          totalRevenue = totalRevenue + unitPriceEuro;
        }
      });

      if(totalRevenue !== 0) {
        pushEventToOptimizely(getMetricName('ventas_euros'), {
          revenue: totalRevenue / 100
        });

        pushEventToOptimizely(getMetricName('ventas'), {
          value: 1.00
        });
      }
    }, 500);
  }
}

export default {
  optiTrackSegmentationISO,
  optiConfirmationRevenue,
  getFromSS,
  pushEventToOptimizely,
  getMetricName,
  pushAttrsToOptimizely,
}
