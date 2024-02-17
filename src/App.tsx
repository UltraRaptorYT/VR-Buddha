import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CV from "./pages/CV";
import Error from "./pages/404";
import Layout from "./pages/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cv" element={<CV />} />
        {/* 404 ERROR */}
        <Route path="/*" element={<Error />} />
      </Route>
    </Routes>
  );
}

export default App;
