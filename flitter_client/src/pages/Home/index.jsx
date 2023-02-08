import useAuthContext from "../../hooks/useAuthContext";
import { FlittersContextProvider } from "../../contexts/FlittersContext";

import Menu from "../../components/Menu";
import { Col, Row } from "react-bootstrap";
import Flitters from "../../components/Flitters";

const Home = () => {
  const { user } = useAuthContext();

  return (
    <FlittersContextProvider>
      <Row>
        {user && (
          <Col md={4}>
            <Menu />
          </Col>
        )}
        <Col md={8} className={!user ? "m-auto" : ''}>
          <Flitters />
        </Col>
      </Row>
    </FlittersContextProvider>
  );
}

export default Home;