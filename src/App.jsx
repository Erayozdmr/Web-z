import { useState } from "react";

import "./App.css";
import Header from "./assets/Components/Header";
import Home from "./assets/pages/Home";
import About from "./assets/pages/About";
import Services from "./assets/pages/Services";
import Footer from "./assets/Components/Footer";
import { ContactUs } from "./assets/pages/Contact";

function App() {
  return (
    <>
      <Header />
      <Home />
      <About />
      <Services />
      <ContactUs />
      <Footer />
    </>
  );
}

export default App;
