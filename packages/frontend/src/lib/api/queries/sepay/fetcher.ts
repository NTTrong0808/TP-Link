import Axios from 'axios'
import qs from 'querystring'

const sepayFetcher = Axios.create({
  baseURL: 'https://qr.sepay.vn',
  paramsSerializer: (params) => qs.stringify(params || {}),
})

export { sepayFetcher }
