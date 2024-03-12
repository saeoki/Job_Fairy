import React from "react";

import "../css/Home.css"; // 스타일 파일 import
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

function Home() {
  return (
    <div className="container-box">
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

export default Home;
