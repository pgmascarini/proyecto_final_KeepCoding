import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import Container from 'react-bootstrap/Container';

const App = () => {
  return (
    <>
      <Header />
      <hr className="mt-0" />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default App;