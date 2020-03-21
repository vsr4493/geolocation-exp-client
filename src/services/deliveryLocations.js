import * as fetch from '../utils/fetch';

export const getAvailableLocations = (address) => {
  return fetch.get(`/location`, {
    payload: { address }
  }).then(res => res.data);
}