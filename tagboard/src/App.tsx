import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./comment/Home/Home"
import { useState } from "react";
import Header from "./comment/Header/Header";
import Navbar from "./comment/Navbar/Navbar";
import Footer from "./comment/Footer/Footer";
import DayShift from "./comment/Dayshift/DayShift";
import NightShift from "./comment/Nightshift/NightShift";
import packageJson from "../package.json";
import Configuration from "./comment/Configuration/Configuration";

function App(): JSX.Element {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  function showHideNav() {
    setIsNavbarVisible(!isNavbarVisible);
  }
  return (
    <BrowserRouter >
      <Header showHideNav={showHideNav} ></Header>
      <div onMouseLeave={showHideNav}><Navbar isVisible={isNavbarVisible} /></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/day-shift" element={<DayShift />} />
        <Route path="/night-shift" element={<NightShift />} />
        <Route path="/configuration/*" element={<Configuration />} />
      </Routes>
      <div className=' bg-roobuck-blue h-fit'>
        <Footer version={packageJson.version}></Footer>
      </div>
    </BrowserRouter>
  );
}
export default App;
