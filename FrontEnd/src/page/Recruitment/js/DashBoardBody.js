import React from "react";

export default function DashBoardBody() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        width: "100%",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "clamp(1.2em, 4vw, 2em)", // 반응형 글자 크기
          color: "#ff6b6b",
          fontWeight: "bold",
          backgroundColor: "#ffe9e9",
          padding: "10px 20px",
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        😊 요즘 채용 한눈에 알아보기 😊
      </h2>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          paddingBottom: "56.25%",
          height: 0,
        }}
      >
        <iframe
          src="https://public.tableau.com/views/1_17120388680510/1_2?:language=ko-KR&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link?:showVizHome=no&:embed=true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="채용공고 트렌드 분석 대시보드"
          allowFullScreen
        />
      </div>
    </div>
  );
}
