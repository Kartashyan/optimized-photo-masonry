import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const AppContainer = styled.div`
  margin: 0 auto;
`;

const App = () => (
  <AppContainer>
    <Outlet />
  </AppContainer>
);

export default App;