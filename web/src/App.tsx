import { Suspense } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <div className="app">
      <Suspense>
        <Header />
        <Outlet />
      </Suspense>
    </div>
  );
}

export default App;
