import React from "react";

export default function DashBoardBody() {
  return (
    <div style={{ position: "relative", paddingBottom: "75%", height: 0 }}>
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
  );
}
