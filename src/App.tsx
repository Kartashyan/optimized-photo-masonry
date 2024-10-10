import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { AppConfigsProvider } from "./ui/components/contexts/configs-context";

const AppContainer = styled.div`
  margin: 0 auto;
`;

const App = () => (
  <AppConfigsProvider>
    <AppContainer>
      <Outlet />
    </AppContainer>
  </AppConfigsProvider>
);

export default App;
