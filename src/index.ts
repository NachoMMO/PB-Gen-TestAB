import data from './data.json' assert { type: 'json' }

import { GenTestAB, Metric } from './types'
import Events from './api/events'
import Experiments from './api/experiments'

const PROJECT_ID = 24787710195
const TEST_ID = '2150158-copy-finish-him'
let experimentID = 0

const parseJSON = (data: GenTestAB) => {
  return {
    ...data,
    events: data.metrics.map((metric: Metric) => ({
      ...metric,
      archived: false,
      category: "other",
      event_type: "custom",
      project_id: PROJECT_ID,
      key: `${metric.key}_${TEST_ID}`,
      name: `${metric.name} ${TEST_ID}`,
    })),
  }
}

const createEvents = async (parsedData: GenTestAB, experimentId: Number) => {
  const parsedMetrics: any = []

  if (!parsedData.events) {
    console.log('No events to create')
    return
  }

  for (const event of parsedData.events) {
    const { id: event_id, key: event_key } = await Events.createEvent(event, PROJECT_ID)
    const metricFounded = parsedData.metrics.find((m: Metric) => `${m.key}_${TEST_ID}` === event_key)

    if (!metricFounded) {
      console.log('No metric founded')
      return
    }

    const { aggregator, field, scope, winning_direction } = metricFounded
    const metric = {
      aggregator,
      event_id,
      field,
      scope,
      winning_direction
    }
    parsedMetrics.push(metric)
  }

  console.log('parsedMetrics ---->> ', parsedMetrics)

  await Events.createMetrics(parsedMetrics, experimentId)
}

// Read data.json
const parsedData: GenTestAB = parseJSON(data)
const experiment = await Experiments.create(parsedData.experiment);
experimentID = experiment.id
await createEvents(parsedData, experiment.id)

// await Experiments.getById(experimentID);
// await Events.getById('27496100106');
