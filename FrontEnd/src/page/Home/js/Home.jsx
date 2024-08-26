import React from "react";

import "../css/Home.css";

import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import Banner from "./Banner";

function Home() {
  return (
    <div className="container_box">
      <Header />
      <Banner />
      <Body />
      <Footer />
    </div>
  );
}

export default Home;
