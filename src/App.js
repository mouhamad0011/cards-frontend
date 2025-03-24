import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster toastOptions={{ duration: 5000 }} />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/admin" element={<Dashboard/>} />
        <Route path="/*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;