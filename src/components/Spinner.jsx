import styled, { keyframes } from "styled-components";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  
  border-top: 2px solid #ccc;
  border-right: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
  border-left: 4px solid #999;
  background: transparent;
  width: 72px;
  height: 72px;
  border-radius: 50%;
`;

export default Spinner;