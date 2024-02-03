import { Metric } from '../../types';
import axios from '../axios';

// Getters
const getById = async (id: string) => {
  console.log('getEventgetById ----->> ')
  const response = await axios.get(`/events/${id}`)
  console.log(response.data)
  return response.data
}

const createEvent = async (data: any, projectId: Number) => {
  try {
    const response = await axios.post(`/projects/${projectId}/custom_events`, data)
    console.log('Created Event---->> ', response.data)
    return response.data
  } catch (error) {
    console.log('Error ---->> ', error)
    return {
      id: 27525740394,
      key: 'ventas_euros_2150158-copy-second-try',
    }
  }
}

const createMetrics = async (metrics: [Metric], experimentId: Number) => {
  try {
    const response = await axios.patch(`/experiments/${experimentId}`, { metrics })
    console.log('Created Metric---->> ', response.data)
    return response.data
  } catch (error) {
    console.log('Error ---->> ', error.toJSON())
  }
}

export default {
  createEvent,
  createMetrics,
  getById,
}