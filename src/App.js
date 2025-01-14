import { Outlet } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useChain } from "./contexts/ChainContext";
import { useEffect } from "react";

function App() {
  const { loadContracts } = useChain();

  useEffect(() => {
    loadContracts();
  }, []);

  return (
    <div className="">
      {/* <div className="background-image" /> */}
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
