import React from 'react';
import AppBar from '../components/AppBar';
import * as deliveryLocationService from '../services/deliveryLocations';
import useFetcher from '../hooks/useFetcher';
import qs from 'query-string';
import { fetchStates } from '../constants';
import styled from 'styled-components';

import MapView from '../components/MapView';
import Spinner from '../components/Spinner';

import { Grid, Box, Header, Paragraph } from 'grommet';

const Container = styled.div`
  min-height: 100%;
  width: 100%;
  padding: 8px;
  &>div {
    border-radius: 4px;
  }
  background: #f9fafc;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
`;

const MapContainer = styled.div`
  width: 100%;
  margin-top: 12px;
  /* Add aspect ratio box to preserve height */
  padding-bottom: 80%;
  position: relative;
  &>div {
    position: absolute;
    left: 0; right: 0; top: 0px; bottom: 0;
    display: flex;
    align-items: top;
    justify-content: center;
  }
  overflow: hidden;
  width: 720px;
  max-width: 100vw;
  flex-grow: 1;
`;

const SearchContainer = styled.div`
  background: #000;
  padding: 24px;
  background: #f9fafc;
  border-radius: 4px;
  border: 1px solid #dedede;
  display: block;
  margin-bottom: 8px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 24px;
  outline: 0;
  border: 0;
  border-radius: 0px;
  border: 2px solid #000;
  font-size: 1.2em;
  margin-top: 12px;
`
const StyledButton = styled.button`
  margin-top: 8px;
  width: 100%;
  background: #34495e;
  border-radius: 0px;
  color: #fff;
  outline: none;
  padding: 8px 24px;
  font-size: 1.2em;
`

const SearchForm = ({ updateSearchFilter, initialValue }) => {
  const [val, setVal] = React.useState(initialValue);
  return (
    <SearchContainer>
      <form onSubmit={(e) => {
        e.preventDefault();
        updateSearchFilter(val);
      }}>
        <Header>
          Enter any location to find delivery outlet!
        </Header>
        <StyledInput 
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <StyledButton type='submit'>
          Search
        </StyledButton>
      </form>
    </SearchContainer>
  );
}

const SearchResults = ({ outlets }) => {
  if (!outlets || outlets.length === 0) {
    return (
      <SearchContainer>
        <Header>Unfortunately, we couldn't find an outlet near you!</Header>
      </SearchContainer>
    );
  }
  return (
    <SearchContainer>
      <Header> Available delivery outlets </Header>
      <br/>
      <Box fill tag="ul" border="top">
        {outlets.map((outlet) => (
          <Box
             tag="li"
             border="bottom"
             pad="small"
             direction="row"
             justify="between"
           >
            {outlet.identifier} in {outlet.city}
           </Box>
        ))}
      </Box>
    </SearchContainer>
  );
};

const SidePane = styled.div`
  display
`

export default ({ match, history }) => {
  const [fetchState, data, error] = useFetcher(
    deliveryLocationService.getAvailableLocations, 
    match.params.address,
  );
  const outlets = fetchState === fetchStates.success && data.outlets;
  // Only use start point (of polygon)
  const targetCoordinate = outlets && outlets.length > 0 ? outlets[0].coordinates[0][0] : null;
  return (
    <Container>
      <Header level='2' size='large'> Showing Location </Header>
      <MapContainer>
        <div>
          {fetchState === fetchStates.waiting && <Spinner />}
          {fetchState === fetchStates.success && outlets.length > 0 &&
            <MapView markerPosition={{ lat: targetCoordinate[1], lng: targetCoordinate[0] }} coordinates={targetCoordinate[0]} />
          }
        </div>
      </MapContainer>
      <div>
        <SearchForm initialValue={match.params.address} updateSearchFilter={(value) => history.replace(`/search-delivery-location/${value}`)} />
        {fetchState === fetchStates.success && <SearchResults outlets={outlets} />}
      </div>
    </Container>
  );
}