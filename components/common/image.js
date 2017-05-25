import styled from 'styled-components';

export default styled.img`
  max-height: ${props => props.size ? props.size : '100%'};
  max-width: 240px;
  width: auto;
  height: 100%;
`;
