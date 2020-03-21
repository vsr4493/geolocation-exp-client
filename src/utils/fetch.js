import fetch from 'isomorphic-fetch';
import qs from 'query-string';

const DEFAULT_TIMEOUT = 40000;
// TODO: Use environment variables
const BASE_PATH = 'http://localhost:3000/api/v1';

export function checkStatus (res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else {
    let err = new Error(res.statusText)
    err.response = res
    throw err
  }
}

export function parseJson (res) {
  return res.json();
}

export function parseError (error) {
  if(error.response && error.response.json) {
    return error.response.json().then(result => {
      return Promise.reject(result);
    });
  }
  return Promise.reject(error);
}

export function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Request Timed out"))
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}

export const get = (url, { payload, withStatus = false, withTimeout = true, headers, ...options} = {}) => {
  const requestBody = {
    method: 'get',
    headers,
    ...options,
  };
  const promise = fetch(`${BASE_PATH}${url}${payload ? '?' + qs.stringify(payload) : ''}`, requestBody)
    .then(checkStatus)
    .then(parseJson)
    .catch(parseError);
  if(withTimeout) {
    return timeoutPromise(DEFAULT_TIMEOUT, promise);
  }
  return promise;
}

export default fetch;