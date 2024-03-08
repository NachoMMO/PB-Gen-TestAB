import { afterEach, describe, expect, it } from 'bun:test'
import TestABTracker from '../src/sharedCode/global/TestABTracker'

let cookies = ''
const inditex = {
  iCountryCode: 'ES',
  readCookie: (cookieName) => {
    return cookies.split(';').find(c => c.includes(cookieName))?.split('=')[1]
  },
  writeCookie: (cookieName, value, expiresDate) => {
    const d = new Date()
    d.setTime(d.getTime() + (expiresDate*24*60*60*1000))
    let expires = "expires="+ d.toUTCString()
    cookies += `${cookieName}=${value};${expires};path=/;`
  }
}

window['inditex'] = inditex

const experimentCode = '1122334'
const productSku = '123456789'

function findMetricInOptimizely(metric) {
  return window['optimizely'].find(m => m.type === metric.type)
}

function findEventInOptimizely(event, value) {
  return window['optimizely'].find(m => m.name === event.name && m.tags?.value === value)
}

function findRevenueMetricInOptimizely(event, value) {
  return window['optimizely'].find(m => m.name === event.name && m.tags?.revenue === value)
}

afterEach(() => {
  sessionStorage.clear()
  cookies = ''
  window['optimizely'] = []
})

describe('TestABTracker Test Cases', () => {
  it('should create new instance', () => {
    const optimizely = new TestABTracker([], experimentCode, () => true)
    expect(optimizely).toBeInstanceOf(TestABTracker)
    expect(optimizely.metrics).toEqual([])
    expect(optimizely.experimentCode).toEqual(experimentCode)
    expect(optimizely.fnAllowBindEvents()).toEqual(true)
  });

  it('should PDP size selected clicked', () => {
    const metrics = {
      'clicks_seleccion_talla': 'clicks_seleccion_talla',
    }
    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.bindPDPSizeSelectedClicked()
    
    document.dispatchEvent(new CustomEvent('click-size', { bubbles: true }))

    const pdpSizeSelectedEvent = {
      name: 'clicks_seleccion_talla',
      tags: {
        value: 1
      }
    }

    const pdpSizeSelectedMetricName = optimizely.getMetricName(pdpSizeSelectedEvent.name)

    expect(findEventInOptimizely(pdpSizeSelectedMetricName, pdpSizeSelectedEvent.tags.value)).toBeDefined()
  })

  it('should search product clicked', () => {
    const metrics = {
      'clicks_productos_buscador': 'clicks_productos_buscador',
    }
    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.bindSearchProductClicked()
    
    document.dispatchEvent(new CustomEvent('product-clicked', {
      bubbles: true,
      detail: {
        product: {
          id: productSku
        }
      }
    }))

    const searchProductClickedEvent = {
      name: 'clicks_productos_buscador',
      tags: {
        value: 1
      }
    }

    const searchProductClickedMetricName = optimizely.getMetricName(searchProductClickedEvent.name)

    expect(findEventInOptimizely(searchProductClickedMetricName, searchProductClickedEvent.tags.value)).toBeDefined()
  
    const productClickedSS = sessionStorage.getItem(`searchProductClickedType${experimentCode}`)
    expect(productClickedSS).toEqual(searchProductClickedEvent.name)
  
  })

  it('should track search impressions events from productModular', () => {
    const metrics = {
      'impresiones': 'impresiones',
    }
    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.bindSearchImpressionEvents()
    
    document.dispatchEvent(new CustomEvent('search-modular-impression', {
      bubbles: true,
      detail: {
        source: ['search']
      }
    }))

    const impressionEvent = {
      name: 'impresiones',
      tags: {
        value: 1
      }
    }

    const impressionMetricName = optimizely.getMetricName(impressionEvent.name)

    expect(findEventInOptimizely(impressionMetricName, impressionEvent.tags.value)).toBeDefined()
  })

  it('should track search impressions events from parrilla in search', () => {
    const metrics = {
      'impresiones': 'impresiones',
    }
    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.bindSearchImpressionEvents()
    
    document.dispatchEvent(new CustomEvent('send-products-impression', {
      bubbles: true,
      detail: {
        products: [ { sku: productSku } , { sku: '987654321' }, { sku: '123456789' } ],
      }
    }))

    const impressionEvent = {
      name: 'impresiones',
      tags: {
        value: 3
      }
    }

    const impressionMetricName = optimizely.getMetricName(impressionEvent.name)

    expect(findEventInOptimizely(impressionMetricName, impressionEvent.tags.value)).toBeDefined()
  })

  it('should push events', () => {
    const metrics = {
      'event_name': 'event_name',
    };

    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    const event = {
      name: 'event_name',
      tags: {
        value: 999
      }
    }
    optimizely.pushEvent(event.name, event.tags)
    const metricName = optimizely.getMetricName(event.name)
    expect(findEventInOptimizely(metricName, event.tags.value)).toBeDefined()
  });

  it('should push attrs', () => {
    const optimizely = new TestABTracker([], experimentCode, () => true)
    const segmentationByISO = {
      type: 'user',
      attributes: {
        sgm_country: 'ES'
      }
    }

    expect(findMetricInOptimizely(segmentationByISO)).toBeDefined()
  });

  it('should persist click on product in sessionStorage', () => {
    const optimizely = new TestABTracker([], experimentCode, () => true)
    optimizely.persistClickProduct(productSku, `clickProduct${experimentCode}`)
    const dataInSS = JSON.parse(sessionStorage.getItem(`clickProduct${experimentCode}`))
    expect(dataInSS).toBeArray()
    expect(dataInSS).toContain(productSku)
  });

  it('should track visits', () => {
    const metrics = {
      'visitas': 'visitas',
      'visitantes_unicos': 'visitantes_unicos',
    }

    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.registerVisits()

    const visitEvent = {
      name: 'visitas',
      tags: {
        value: 1
      }
    }

    const uniqueVisitEvent = {
      name: 'visitantes_unicos',
      tags: {
        value: 1
      }
    }

    const visitMetricName = optimizely.getMetricName(visitEvent.name)
    const uniqueVisitMetricName = optimizely.getMetricName(uniqueVisitEvent.name)

    expect(findEventInOptimizely(visitMetricName, visitEvent.tags.value)).toBeDefined()
    expect(findEventInOptimizely(uniqueVisitMetricName, uniqueVisitEvent.tags.value)).toBeDefined()
  });

  it('should track add to cart from search in parrilla', () => {
    const metrics = {
      'cestas_arrastradas_buscador': 'cestas_arrastradas_buscador',
      'clicks_productos_buscador': 'clicks_productos_buscador',
    }
    window['inditex'].iProductId = productSku

    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.trackSearchProductClicked(productSku)
    optimizely.trackAddToCartSearchFromParrilla(productSku)

    const addToCartEvent = {
      name: 'cestas_arrastradas_buscador',
      tags: {
        value: 1
      }
    }

    const addToCartMetricName = optimizely.getMetricName(addToCartEvent.name)

    expect(findEventInOptimizely(addToCartMetricName, addToCartEvent.tags.value)).toBeDefined()

    const productCookie = inditex.readCookie(`optiProductsSku${experimentCode}`) || '[]'
    const productCookieParsed = JSON.parse(productCookie) || []
    expect(productCookieParsed).toBeArray()
    expect(productCookieParsed).toContain(productSku)
  });

  it('should track add to cart from PDP', () => {
    const metrics = {
      'clicks_add_to_cart': 'clicks_add_to_cart',
    }

    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.trackAddToCartFromPDP(productSku)

    const addToCartEvent = {
      name: 'clicks_add_to_cart',
      tags: {
        value: 1
      }
    }

    const addToCartMetricName = optimizely.getMetricName(addToCartEvent.name)

    expect(findEventInOptimizely(addToCartMetricName, addToCartEvent.tags.value)).toBeDefined()

    const productCookie = inditex.readCookie(`optiProductsSku${experimentCode}`) || '[]'
    const productCookieParsed = JSON.parse(productCookie) || []
    expect(productCookieParsed).toBeArray()
    expect(productCookieParsed).toContain(productSku)
  });

  it('should track revenue', (done) => {
    const metrics = {
      'ventas': 'ventas',
      'ventas_euros': 'ventas_euros',
      'visitas': 'visitas',
      'visitantes_unicos': 'visitantes_unicos',
    }

    window['inditex'].iXOrderOrderSummaryJSON = {
      items: [
        {
          sku: productSku,
          quantity: 1,
          totalOrderEuro: 999,
          unitPriceEuro: 999
        }
      ],
      totalOrderEuro: 999
    }

    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.registerVisits()
    optimizely.updateProductCookie(productSku)
    optimizely.trackConfirmationRevenue()

    setTimeout(() => {
      const revenueEvent = {
        name: 'ventas_euros',
        tags: {
          revenue: 999
        }
      }

      const revenueEventCount = {
        name: 'ventas',
        tags: {
          value: 1
        }
      }

      const revenueMetricName = optimizely.getMetricName(revenueEvent.name)
      const revenueMetricCountName = optimizely.getMetricName(revenueEventCount.name)

      expect(findRevenueMetricInOptimizely(revenueMetricName, revenueEvent.tags.revenue)).toBeDefined()
      expect(findEventInOptimizely(revenueMetricCountName, revenueEventCount.tags.value)).toBeDefined()

      done()
    }, 500);
  });

  it('should track impression', () => {
    const metrics = {
      'impresiones': 'impresiones',
    }

    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.trackImpression()

    const impressionEvent = {
      name: 'impresiones',
      tags: {
        value: 1
      }
    }

    const impressionMetricName = optimizely.getMetricName(impressionEvent.name)

    expect(findEventInOptimizely(impressionMetricName, impressionEvent.tags.value)).toBeDefined()
  });

  it('should track search product clicked', ()=> {
    const metrics = {
      'clicks_productos_buscador': 'clicks_productos_buscador',
    }

    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.trackSearchProductClicked(productSku)

    const searchProductClickedEvent = {
      name: 'clicks_productos_buscador',
      tags: {
        value: 1
      }
    }

    const searchProductClickedMetricName = optimizely.getMetricName(searchProductClickedEvent.name)

    expect(findEventInOptimizely(searchProductClickedMetricName, searchProductClickedEvent.tags.value)).toBeDefined()
  
    const productClickedSS = sessionStorage.getItem(`searchProductClickedType${experimentCode}`)
    expect(productClickedSS).toEqual(searchProductClickedEvent.name)
  });

  it('should track PDP color selected clicked', () => {
    const metrics = {
      'clicks_seleccion_color': 'clicks_seleccion_color',
    }

    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.trackPDPColorSelectedClicked()

    const pdpColorSelectedEvent = {
      name: 'clicks_seleccion_color',
      tags: {
        value: 1
      }
    }

    const pdpColorSelectedMetricName = optimizely.getMetricName(pdpColorSelectedEvent.name)

    expect(findEventInOptimizely(pdpColorSelectedMetricName, pdpColorSelectedEvent.tags.value)).toBeDefined()
  });

  it('should track PDP size selected clicked', () => {
    const metrics = {
      'clicks_seleccion_talla': 'clicks_seleccion_talla',
    }

    const optimizely = new TestABTracker(metrics, experimentCode, () => true)
    optimizely.trackPDPSizeSelectedClicked()

    const pdpSizeSelectedEvent = {
      name: 'clicks_seleccion_talla',
      tags: {
        value: 1
      }
    }

    const pdpSizeSelectedMetricName = optimizely.getMetricName(pdpSizeSelectedEvent.name)

    expect(findEventInOptimizely(pdpSizeSelectedMetricName, pdpSizeSelectedEvent.tags.value)).toBeDefined()
  });

  it('should update product cookie', () => {
    const optimizely = new TestABTracker([], experimentCode, () => true)
    optimizely.updateProductCookie(productSku)
    const productCookie = inditex.readCookie(`optiProductsSku${experimentCode}`) || '[]'
    const productCookieParsed = JSON.parse(productCookie) || []
    expect(productCookieParsed).toBeArray()
    expect(productCookieParsed).toContain(productSku)
  });
});