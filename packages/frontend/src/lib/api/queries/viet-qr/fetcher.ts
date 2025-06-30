import Axios from "axios";
import qs from "querystring";

const vietqrFetcher = Axios.create({
  baseURL: "https://api.vietqr.io/v2",
  paramsSerializer: (params) => qs.stringify(params || {}),
});

export { vietqrFetcher };
