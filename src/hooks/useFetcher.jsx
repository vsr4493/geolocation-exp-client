import React from 'react';
import { fetchStates } from '../constants';
import { identity } from 'kari';

// Identity function with arity of one. Works for api responses.
export default function useFetcher(fetchData, requestArgs = null, responseLens = identity) {
  const [fetchState, setFetchState] = React.useState(fetchStates.none);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    setFetchState(fetchStates.waiting);
    fetchData(requestArgs)
      .then((res) => setData(responseLens(res)) || setFetchState(fetchStates.success))
      .catch(error => setError(error) || setFetchState(fetchStates.failure));
  }, [requestArgs]);
  return [fetchState, data, error];
}