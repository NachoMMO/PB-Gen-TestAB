import { MetricAggregator, MetricScope, WinningDirection } from "./enums"
import { Metric } from "./types"

export const audiences = {
  only_mobile: '[\"and\", {\"audience_id\": 25023530143}]',
  only_desktop: '[\"and\", {\"audience_id\": 25027240147}]',
  all_devices: '[\"and\", {\"audience_id\": 24939771411}]'
}

export const metrics: Metric[] = [
  {
    key: "ventas_euros",
    name: "Ventas en euros",
    aggregator: MetricAggregator.Sum,
    field: "revenue",
    scope: MetricScope.Event,
    winning_direction: WinningDirection.Increase
  },
  {
    key: "ventas",
    name: "Ventas",
    aggregator: MetricAggregator.Count,
    scope: MetricScope.Visitor,
    winning_direction: WinningDirection.Increase
  },
  {
    key: "visitas",
    name: "Visitas",
    aggregator: MetricAggregator.Count,
    scope: MetricScope.Visitor,
    winning_direction: WinningDirection.Increase
  },
  {
    key: "visitantes_unicos",
    name: "Visitantes Unicos",
    aggregator: MetricAggregator.Unique,
    scope: MetricScope.Visitor,
    winning_direction: WinningDirection.Increase
  },
  {
    key: "clicks_productos_buscador",
    name: "Clicks en productos del buscador",
    aggregator: MetricAggregator.Count,
    scope: MetricScope.Visitor,
    winning_direction: WinningDirection.Increase
  },
  {
    key: "clicks_seleccion_color",
    name: "Clicks en selección de color",
    aggregator: MetricAggregator.Count,
    scope: MetricScope.Visitor,
    winning_direction: WinningDirection.Increase
  },
  {
    key: "clicks_add_to_cart",
    name: "Clicks añadir al carrito",
    aggregator: MetricAggregator.Count,
    scope: MetricScope.Visitor,
    winning_direction: WinningDirection.Increase
  },
  {
    key: "cestas_arrastradas_buscador",
    name: "Cestas arrastradas en buscador",
    aggregator: MetricAggregator.Count,
    scope: MetricScope.Visitor,
    winning_direction: WinningDirection.Increase
  },
  {
    key: "impresiones",
    name: "Impresiones",
    aggregator: MetricAggregator.Count,
    scope: MetricScope.Visitor,
    winning_direction: WinningDirection.Increase
  }
]
