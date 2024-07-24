import React from "react";

import "../css/Home.css";

import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

function Home() {
  return (
    <div className="container_box">
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

export default Home;
