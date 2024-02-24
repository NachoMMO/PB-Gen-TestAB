import { audiences, metrics } from './database.ts'
import { EntryTestData, GenTestAB, Metric } from './types'

/**
 * Se encarga de obtener los datos necesarios para crear un experimento
 * en Optimizely.
 *
 * @param {EntryTestData} data - Datos del experimento en el archivo JSON
 * de configuración de experimentos.
 * @param {Number} project_id - ID del proyecto en Optimizely.
 * @param {String} experimentCode - Código del experimento.
 *
 * @returns {GenTestAB} - Datos necesarios para crear un experimento en
 * Optimizely.
 */
function getExperimentDataParsed(data: EntryTestData, project_id: Number, experimentCode: String) {
  const metricsParsed: Metric[]  = data.metrics_keys.map((metric: String) =>  metrics.find(m => m.key === metric)).filter(m => m) as Metric[]
  const { audience, code, countries, description, name } = data
  const audienceSelected = audiences[audience]

  return {
    experiment: {
      allocation_policy: 'manual',
      audience_conditions: audienceSelected,
      code,
      description,
      holdback: 0,
      name: `ITSMECOM-${experimentCode}: ${name}`,
      project_id,
      status: "not_started",
      traffic_allocation: 10000,
      type: "a/b",
      url_targeting: {
        activation_type: "immediate",
        conditions: `[\"and\", [\"or\", {\"match_type\": \"regex\", \"type\": \"url\", \"value\": \"www.pullandbear.com/(${countries.join('|')})/.?\"}]]`,
        edit_url: "https://www.pullandbear.com/es/mujer-n6417"
      },
      variations: [
        {
          actions: [],
          archived: false,
          name: "Original",
          status: "active",
          weight: 5000
        },
        {
          actions: [],
          archived: false,
          name: "Experimento",
          status: "active",
          weight: 5000
        }
      ]
    },
    events: metricsParsed.map((metric: Metric) => ({
      ...metric,
      archived: false,
      category: "other",
      event_type: "custom",
      project_id,
      key: `${metric.key}_${experimentCode}`,
      name: `${metric.name} ${experimentCode}`,
    })),
  }
}

export {
  getExperimentDataParsed,
}
