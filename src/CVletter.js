/* 자기소개서 */
import React, { useState } from "react";

function CVletter() {
  const [selectedJob, setSelectedJob] = useState("");
  const [keywords, setKeywords] = useState("");
  const [applyPersonalSettings, setApplyPersonalSettings] = useState(false);
  const [additionalContent, setAdditionalContent] = useState("");

  const handleApplySettingsChange = () => {
    setApplyPersonalSettings(!applyPersonalSettings);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 여기에서 입력된 내용 활용 또는 처리

    // 초기화
    setSelectedJob("");
    setKeywords("");
    setApplyPersonalSettings(false);
    setAdditionalContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        직무를 선택해주세요:
        <input
          type="text"
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          placeholder={!selectedJob ? "내용을 입력해주세요" : ""}
        />
      </label>

      <label>
        자기소개서 키워드를 입력하기:
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder={!keywords ? "내용을 입력해주세요" : ""}
        />
      </label>

      <label>
        추가 내용:
        <textarea
          value={additionalContent}
          onChange={(e) => setAdditionalContent(e.target.value)}
          placeholder={!additionalContent ? "내용을 입력해주세요" : ""}
        />
      </label>

      <label>
        개인 설정 적용하기:
        <input
          type="checkbox"
          checked={applyPersonalSettings}
          onChange={handleApplySettingsChange}
        />
      </label>

      <button type="submit">제출</button>
    </form>
  );
}

export default CVletter;
