import React, {useEffect} from "react";

import "../css/Home.css";

import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import Banner from "./Banner";

function Home() {
  useEffect(() => {
    // 전체 페이지 배경색
    document.body.style.backgroundColor = 'white'; 
  })
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
