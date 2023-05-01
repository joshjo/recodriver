import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from "@constants";
import resource from './resource';
import type { AuthAPIResource } from './resource'

const axiosInstance = axios.create({
  baseURL: "http://192.168.60.75:8956",
  // required to allow serialization of multiple params with the same name in GET
  // requests (&service_id=<A>&service_id=<B>&service_id=<C>)
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const Auth: AuthAPIResource = resource(
  "auth",
  axiosInstance,
  {
    token: (baseResourceURL, request) => (data: any) => {
      return request({
        url: `${baseResourceURL}/token/`,
        method: 'POST',
        data,
      });
    },
  },
);

export default {
  Auth,
}
