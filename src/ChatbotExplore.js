import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./App.css";





function ChatbotExplore() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);

  // 챗봇 목록 가져오기 (API 서버에서만)
  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        if (!baseUrl) {
          throw new Error("API 서버가 설정되지 않았습니다.");
        }

        console.log("API 호출 시도:", `${baseUrl}/chatbots/`);
        const response = await fetch(`${baseUrl}/chatbots/`);
        console.log("API 응답 상태:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("API에서 받은 데이터:", data);
          // API 응답이 배열인지 확인하고 설정
          const chatbotList = Array.isArray(data) ? data : [data];
          setChatbots(chatbotList);
        } else {
          throw new Error(`API 호출 실패: ${response.status}`);
        }
      } catch (error) {
        console.error("챗봇 목록을 가져오는데 실패했습니다:", error);
        setChatbots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbots();
  }, []);



  // 필터링된 챗봇 목록
  const filteredChatbots = chatbots.filter(chatbot => {
    const matchesSearch = chatbot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chatbot.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // 챗봇 카드 클릭 핸들러
  const handleChatbotClick = (chatbot) => {
    // 상세 페이지로 이동
    navigate(`/chatbot/${chatbot.id}`);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        maxWidth: 1200, margin: "0 auto", padding: "60px 60px 80px 60px"
      }}>
        {/* 페이지 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 20 }}>
            챗봇 탐색
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#c3cbe7" }}>
            다양한 챗봇들을 발견하고 활용해보세요
          </p>
        </motion.div>

        {/* 검색 및 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ marginBottom: 50 }}
        >
          {/* 검색바 */}
          <div style={{ marginBottom: 30 }}>
            <input
              type="text"
              placeholder="챗봇 이름이나 설명으로 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "1.1rem",
                backdropFilter: "blur(10px)"
              }}
            />
          </div>


        </motion.div>

        {/* 챗봇 목록 */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "60px 0" }}
          >
            <div style={{ fontSize: "1.2rem", color: "#c3cbe7" }}>챗봇 목록을 불러오는 중...</div>
          </motion.div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: 32
          }}>
            {filteredChatbots.map((chatbot, idx) => (
              <motion.div
                key={chatbot.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                                 whileHover={{ 
                   y: -8, 
                   scale: 1.02,
                   border: "1px solid rgba(37, 99, 235, 0.3)",
                   boxShadow: "0 8px 32px rgba(37, 99, 235, 0.15)"
                 }}
                 transition={{ 
                   duration: 0.1, 
                   // delay: 0.1 * idx,
                   hover: { duration: 0.2 }
                 }}
                 style={{
                   background: "rgba(255,255,255,0.05)",
                   borderRadius: 20,
                   padding: "32px",
                   cursor: "pointer",
                   border: "1px solid rgba(255,255,255,0.1)",
                   backdropFilter: "blur(10px)",
                   transition: "all 0.2s ease"
                 }}
                onClick={() => handleChatbotClick(chatbot)}
              >
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🤖</div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 12 }}>
                    {chatbot.name}
                  </h3>
                  <p style={{ color: "#c3cbe7", fontSize: "1rem", lineHeight: 1.5 }}>
                    {chatbot.description}
                  </p>
                </div>
                
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 20
                }}>
                  <span style={{
                    background: "#2563eb",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: "0.9rem",
                    fontWeight: "bold"
                  }}>
                    {chatbot.category}
                  </span>
                  <span style={{ color: "#a3bffa", fontSize: "0.9rem" }}>
                    {formatDate(chatbot.created_at)}
                  </span>
                </div>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ color: "#c3cbe7", fontSize: "0.9rem" }}>
                    모델: {chatbot.model_name}
                  </span>
                  <button style={{
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    cursor: "pointer"
                  }}>
                    상세보기
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {!loading && filteredChatbots.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "60px 0" }}
          >
            <div style={{ fontSize: "1.2rem", color: "#c3cbe7", marginBottom: 20 }}>
              검색 결과가 없습니다.
            </div>
            <Link to="/register" style={{
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: 12,
              fontWeight: "bold"
            }}>
              첫 번째 챗봇 등록하기
            </Link>
          </motion.div>
        )}
      </div>


    </div>
  );
}

export default ChatbotExplore; 