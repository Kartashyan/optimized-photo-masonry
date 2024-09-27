import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const App = () => (
  <AppContainer>
    <h1>Optimized Photo Masonry</h1>
    <Outlet />
  </AppContainer>
);

export default App;