import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CV from "./pages/CV";
import CVRoom from "./pages/CVRoom";
import Error from "./pages/404";
import Layout from "./pages/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/cv/:room_id" element={<CVRoom />} />
        {/* 404 ERROR */}
        <Route path="/*" element={<Error />} />
      </Route>
    </Routes>
  );
}

export default App;
