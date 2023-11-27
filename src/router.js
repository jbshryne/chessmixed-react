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
import GamesList from "./pages/GamesList";

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
            <GamesList />
          </AuthChecker>
        }
      />
    </Route>
  )
);

export default router;
