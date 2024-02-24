import axios from '../axios';

// Getters
const getById = async (id: Number) => {
  console.log('getbyId ----->> ')
  const response = await axios.get(`/experiments/${id}`)
  console.log(response.data)
  return response.data
}

// Create
const create = async (data: any) => {
  try {
    const response = await axios.post('/experiments', data)
    // console.log('Created ---->> ', response.data)
    return response.data
  } catch (error) {
    console.log('Error ---->> ', error.toJSON())
  }
}

// Update
const updateSharedCode = async (id: Number, sharedCode: String) => {
  try {
    const data = {
      changes: [
        {
          type: "custom_code",
          async: false,
          value: sharedCode
        }
      ]
    }
    await axios.patch(`/experiments/${id}`, data)
  } catch (error) {
    console.log('Error ---->> ', error.message)
  }
}

export default {
  create,
  getById,
  updateSharedCode,
}