import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./App.css";


const modelOptions = [
  { label: "gpt-5", value: "gpt-5" },
  { label: "gpt-5-mini", value: "gpt-5-mini" },
  { label: "gpt-5-nano", value: "gpt-5-nano" },
  { label: "gpt-4.1", value: "gpt-4.1" },
  { label: "gpt-4.1-mini", value: "gpt-4.1-mini" },
  { label: "gpt-4.1-nano", value: "gpt-4.1-nano" },
  { label: "gpt-4o", value: "gpt-4o" },
  { label: "gpt-4o-mini", value: "gpt-4o-mini" },
];

function ChatbotRegister() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "기타",
    icon: "",
    features: "",
    model_name: "gpt-4o-mini",
    system_prompt: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [createdInfo, setCreatedInfo] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setCreatedInfo(null);

    if (!formData.name || !formData.description || !formData.model_name) {
      setSubmitError("필수 항목(*)을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const chatbotDataPayload = {
      name: formData.name,
      description: formData.description,
      model_name: formData.model_name,
      system_prompt: formData.system_prompt || "",
    };

    const body = new FormData();
    body.append("chatbot_data", JSON.stringify(chatbotDataPayload));
    if (file) body.append("file", file);

    const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

    try {
      if (!baseUrl) {
        throw new Error("API 서버가 설정되지 않았습니다.");
      }

      console.log("챗봇 등록 API 호출:", `${baseUrl}/chatbots/`);
      console.log("전송 데이터:", chatbotDataPayload);
      
      const res = await fetch(`${baseUrl}/chatbots/`, {
        method: "POST",
        body,
      });
      
      console.log("등록 응답 상태:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("등록 실패:", errorData);
        throw new Error(`서버 오류: ${res.status} - ${errorData.detail || '알 수 없는 오류'}`);
      }
      
      const data = await res.json();
      console.log("등록 성공:", data);
      setCreatedInfo(data);

      setSubmitSuccess("챗봇이 성공적으로 등록되었습니다.");
      // 1초 후 챗봇 탐색으로 이동
      setTimeout(() => navigate("/explore"), 1000);
    } catch (err) {
      console.error("챗봇 등록 실패:", err);
      setSubmitError(err.message || "등록 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
         <div style={{
       minHeight: "100vh",
       background: "linear-gradient(120deg, #050a12, #0f1a24 80%)",
       color: "#fff",
       fontFamily: "Pretendard, sans-serif"
     }}>
      <Navigation />

      {/* 메인 컨텐츠 */}
      <div style={{
        maxWidth: 800, margin: "0 auto", padding: "40px 60px",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ fontSize: "2.5rem", fontWeight: 800, textAlign: "center", marginBottom: 20 }}
        >
          챗봇 등록하기
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ fontSize: "1.2rem", color: "#c3cbe7", textAlign: "center", marginBottom: 40 }}
        >
          당신만의 특별한 챗봇을 만들어 다른 사용자들과 공유해보세요
        </motion.p>

        {/* 등록 폼 */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 600,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 24,
            padding: "30px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          {/* 챗봇 이름 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "1.1rem" }}>
              챗봇 이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="챗봇의 이름을 입력하세요"
              style={{
                width: "590px",
                height: "40px",
                padding : '0 0 0 10px',
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "1rem"
              }}
            />
          </div>

          {/* 챗봇 설명 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "1.1rem" }}>
              챗봇 설명 *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="챗봇이 어떤 기능을 하는지 설명해주세요"
              rows={3}
              style={{
                width: "590px",
                height: "80px",
                padding : '10px 0 0 10px',
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "1rem",
                resize: "vertical"
              }}
            />
          </div>

          {/* 카테고리 선택 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "1.1rem" }}>
              카테고리
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: "590px",
                padding: "16px 20px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "1rem"
              }}
            >
              <option value="번역" style={{ background: "#1a1a1a", color: "#fff" }}>번역</option>
              <option value="업무" style={{ background: "#1a1a1a", color: "#fff" }}>업무</option>
              <option value="고객상담" style={{ background: "#1a1a1a", color: "#fff" }}>고객상담</option>
              <option value="학습" style={{ background: "#1a1a1a", color: "#fff" }}>학습</option>
              <option value="엔터테인먼트" style={{ background: "#1a1a1a", color: "#fff" }}>엔터테인먼트</option>
              <option value="기타" style={{ background: "#1a1a1a", color: "#fff" }}>기타</option>
            </select>
          </div>

          {/* 모델 선택 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "1.1rem" }}>
              모델 선택 *
            </label>
            <select
              name="model_name"
              value={formData.model_name}
              onChange={handleChange}
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "16px 20px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "1rem"
              }}
            >
              {modelOptions.map((m) => (
                <option 
                  key={m.value} 
                  value={m.value}
                  style={{
                    background: "#1a1a1a",
                    color: "#fff",
                    padding: "8px"
                  }}
                >
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* 시스템 프롬프트 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "1.1rem" }}>
              시스템 프롬프트
            </label>
            <textarea
              name="system_prompt"
              value={formData.system_prompt}
              onChange={handleChange}
              placeholder="모델의 기본 역할/가이드를 작성하세요"
              rows={3}
              style={{
                width: "590px",
                height: "80px",
                padding: "10px 0 0 10px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "1rem",
                resize: "vertical"
              }}
            />
          </div>

          {/* 파일 업로드 (선택) */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "1.1rem" }}>
              문서 업로드 (선택)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              style={{ display: "block" }}
            />
            <div style={{ marginTop: 6, color: "#c3cbe7", fontSize: 13 }}>PDF/텍스트 등 지원 여부는 서버 설정에 따릅니다.</div>
          </div>

          {/* 주요 기능 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "1.1rem" }}>
              주요 기능
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="챗봇의 주요 기능들을 설명해주세요"
              rows={3}
              style={{
                width: "590px",
                height: "150px",
                padding : '10px 0 0 10px',
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "1rem",
                resize: "vertical"
              }}
            />
          </div>

          {/* 등록 버튼 */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            style={{
              width: "100%",
              background: isSubmitting ? "#1f4fd1" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "18px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 24px #2563eb44"
            }}
          >
            {isSubmitting ? "등록 중..." : "챗봇 등록하기"}
          </motion.button>

          {submitError && (
            <div style={{ marginTop: 14, color: "#ffb4b4", fontSize: 14 }}>{submitError}</div>
          )}
          {submitSuccess && (
            <div style={{ marginTop: 14, color: "#a3ffcf", fontSize: 14 }}>{submitSuccess}</div>
          )}
          {createdInfo && (
            <div style={{ marginTop: 12, fontSize: 13, color: "#c3cbe7" }}>
              생성된 챗봇: {createdInfo.name || "-"} / ID: {createdInfo.id ?? "-"}
            </div>
          )}
        </motion.form>
      </div>
    </div>
  );
}

export default ChatbotRegister; 