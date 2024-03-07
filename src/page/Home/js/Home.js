import React from "react";

import "../css/Home.css"; // 스타일 파일 import
import Header from "./Header";
import Body from "./Body";

function Home() {
  return (
    <div className="container-box">
      <Header />
      <Body />
    </div>
  );
}

export default Home;
