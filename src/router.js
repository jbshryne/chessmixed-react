import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Lobby from "./pages/Lobby";
import AuthChecker from "./components/AuthChecker";
import Games from "./pages/Games";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route
        path="/lobby"
        element={
          <AuthChecker>
            <Lobby />
          </AuthChecker>
        }
      />
      <Route
        path="/games"
        element={
          <AuthChecker>
            <Games />
          </AuthChecker>
        }
      />
    </Route>
  )
);

export default router;
