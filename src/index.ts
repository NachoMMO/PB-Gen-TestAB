import data from './data.json' assert { type: 'json' }

import { EntryTestData, GenTestAB, Metric } from './types'
import { getExperimentDataParsed } from './utils'

import Events from './api/events'
import Experiments from './api/experiments'

const PROJECT_ID = 24787710195
const ENTRY_DATA = data as EntryTestData
const EXPERIMENT_CODE: String = ENTRY_DATA.code

const createEvents = async (parsedData: GenTestAB, experimentId: Number) => {
  const parsedMetrics: any = []

  if (!parsedData.events) {
    console.log('No events to create')
    return
  }

  for (const event of parsedData.events) {
    const { id: event_id, key: event_key } = await Events.createEvent(event, PROJECT_ID)
    const metricFounded = parsedData.events.find((m: Metric) => m.key === event_key)

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

  await Events.createMetrics(parsedMetrics, experimentId)
}

const main = async () => {
  try {
    const parsedData: GenTestAB = getExperimentDataParsed(ENTRY_DATA, PROJECT_ID, EXPERIMENT_CODE)
    console.log(parsedData)

    // const path = "./build/index.js";
    // const file = Bun.file(path);

    // const text = await file.text();
    // console.log(text);
    const experiment = await Experiments.create(parsedData.experiment);
    await createEvents(parsedData, experiment.id);
    // await Experiments.updateSharedCode(27732380067, text);
  } catch (err) {
    console.error(err)
  }
}

// await Experiments.getById(experiment.id);
// await Events.getById('27496100106');

main()
