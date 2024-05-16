import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import CV from "./pages/CV";
import CVRoom from "./pages/CVRoom";
import Room from "./pages/Room";
import Error from "./pages/404";
import Layout from "./pages/Layout";

function App() {
  const [showOffering, setShowOffering] = useState<boolean>(false);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          path="/"
          element={
            <Home
              showOffering={showOffering}
              setShowOffering={setShowOffering}
            />
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/cv/:room_id" element={<CVRoom />} />
        <Route path="/:room_id" element={<Room />} />
        {/* 404 ERROR */}
        <Route path="/*" element={<Error />} />
      </Route>
    </Routes>
  );
}

export default App;
