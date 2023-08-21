import axios from 'axios'

export default axios.create({
  baseURL: 'https://endpoint.inventroapp.com/api/admin/'
  //baseURL: 'http://localhost/api/'
})
