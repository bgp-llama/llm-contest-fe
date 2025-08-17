import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./App.css";

function ChatbotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  // 챗봇 상세 정보 가져오기 (API 서버에서만)
  useEffect(() => {
    const fetchChatbotDetail = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        if (!baseUrl) {
          throw new Error("API 서버가 설정되지 않았습니다.");
        }

        console.log("챗봇 상세 정보 API 호출:", `${baseUrl}/chatbots/${id}`);
        const response = await fetch(`${baseUrl}/chatbots/${id}`);
        console.log("챗봇 상세 정보 응답 상태:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("챗봇 상세 정보:", data);
          // API 스키마에 맞는 데이터 구조 확인
          if (data && typeof data === 'object' && 'id' in data) {
            setChatbot(data);
          } else {
            throw new Error("잘못된 응답 형식입니다.");
          }
        } else {
          throw new Error(`챗봇을 찾을 수 없습니다. (${response.status})`);
        }
      } catch (err) {
        console.error("챗봇 상세 정보 가져오기 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbotDetail();
  }, [id]);

  // 챗봇 문서 목록 가져오기
  useEffect(() => {
    if (chatbot) {
      const fetchDocuments = async () => {
        try {
          const baseUrl = process.env.REACT_APP_API_BASE_URL;
          if (baseUrl) {
            const response = await fetch(`${baseUrl}/chatbots/${id}/documents`);
            if (response.ok) {
              const data = await response.json();
              setDocuments(data);
            }
          }
        } catch (error) {
          console.error("문서 목록을 가져오는데 실패했습니다:", error);
        }
      };

      fetchDocuments();
    }
  }, [chatbot, id]);

  // 대화 세션 생성
  useEffect(() => {
    if (chatbot) {
      const createConversation = async () => {
        try {
          const baseUrl = process.env.REACT_APP_API_BASE_URL;
          if (baseUrl) {
            console.log("대화 세션 생성:", `${baseUrl}/chat/conversations`);
            const response = await fetch(`${baseUrl}/chat/conversations`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: `${chatbot.name}와의 대화`,
                chatbot_id: chatbot.id
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log("대화 세션 생성 성공:", data);
              setConversationId(data.id);
            } else {
              console.error("대화 세션 생성 실패:", response.status);
            }
          }
        } catch (error) {
          console.error("대화 세션 생성 중 오류:", error);
        }
      };

      createConversation();
    }
  }, [chatbot]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      conversation_id: conversationId,
      role: "user",
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);

    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      if (baseUrl) {
        // 실제 API 호출
        console.log("API 호출:", `${baseUrl}/chat`);
        const response = await fetch(`${baseUrl}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage,
            conversation_id: conversationId
          })
        });
        console.log("API 응답 상태:", response.status);

        if (response.ok) {
          const data = await response.json();
          const botMessage = {
            id: Date.now() + 1,
            content: data.message || data.response || "응답을 받았습니다.",
            role: "assistant",
            created_at: new Date().toISOString()
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          console.error("API 응답 오류:", response.status, response.statusText);
          throw new Error(`메시지 전송에 실패했습니다. (${response.status})`);
        }
      } else {
        // 로컬 시뮬레이션
        setTimeout(() => {
          const botMessage = {
            id: Date.now() + 1,
            content: `안녕하세요! ${chatbot.name}입니다. "${inputMessage}"에 대한 답변을 드리겠습니다.`,
            role: "assistant",
            created_at: new Date().toISOString()
          };
          setMessages(prev => [...prev, botMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "죄송합니다. 메시지 전송에 실패했습니다.",
        role: "assistant",
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 시간 포맷팅
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #0a1624, #1a2a3a 80%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Pretendard, sans-serif"
      }}>
        <div style={{ fontSize: "1.2rem", color: "#c3cbe7" }}>챗봇 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #0a1624, #1a2a3a 80%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Pretendard, sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.2rem", color: "#ff7f7f", marginBottom: 20 }}>{error}</div>
          <Link to="/explore" style={{
            background: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            padding: "12px 24px",
            borderRadius: 12,
            fontWeight: "bold"
          }}>
            챗봇 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

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
        maxWidth: 1400, margin: "0 auto", padding: "40px 60px 80px 60px",
        display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40
      }}>
        {/* 왼쪽: 챗봇 정보 */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 24,
            padding: "32px",
            height: "fit-content",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 12 }}>
              {chatbot.name}
            </h1>
            <p style={{ color: "#c3cbe7", fontSize: "1rem", lineHeight: 1.6 }}>
              {chatbot.description}
            </p>
          </div>

          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 16 }}>
              챗봇 정보
            </h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#a3bffa" }}>모델:</span>
                <span>{chatbot.model_name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#a3bffa" }}>등록일:</span>
                <span>{formatDate(chatbot.created_at)}</span>
              </div>
              {chatbot.category && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#a3bffa" }}>카테고리:</span>
                  <span>{chatbot.category}</span>
                </div>
              )}
            </div>
          </div>

          {chatbot.system_prompt && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 16 }}>
                시스템 프롬프트
              </h3>
              <div style={{
                background: "rgba(255,255,255,0.05)",
                padding: "16px",
                borderRadius: 12,
                color: "#c3cbe7",
                fontSize: "0.95rem",
                lineHeight: 1.5
              }}>
                {chatbot.system_prompt}
              </div>
            </div>
          )}

          {/* 문서 목록 */}
          {documents.length > 0 && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 16 }}>
                첨부 문서 ({documents.length})
              </h3>
              <div style={{ display: "grid", gap: 8 }}>
                {documents.map((doc) => (
                  <div key={doc.id} style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "12px",
                    borderRadius: 8,
                    fontSize: "0.9rem"
                  }}>
                    <div style={{ fontWeight: "bold", marginBottom: 4 }}>{doc.filename}</div>
                    <div style={{ color: "#a3bffa", fontSize: "0.8rem" }}>{doc.file_type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/explore")}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: 20
            }}
          >
            다른 챗봇 보기
          </button>
        </motion.div>

        {/* 오른쪽: 대화 영역 */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            height: 780,
            // maxHeight: "calc(100vh - 120px)"
          }}
        >
          {/* 대화 헤더 */}
          <div style={{
            padding: "24px 32px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600 }}>
              {chatbot.name}와 대화하기
            </h2>
            <button
              onClick={() => setMessages([])}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              대화 초기화
            </button>
          </div>

          {/* 메시지 영역 */}
          <div style={{
            flex: 1,
            padding: "24px 32px",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxHeight: "calc(85vh - 55px)",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.3) transparent"
          }}
          className="chat-scrollbar">
            {messages.length === 0 ? (
              <div style={{
                textAlign: "center",
                color: "#c3cbe7",
                marginTop: "20%"
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                <div style={{ fontSize: "1.2rem", marginBottom: 8 }}>
                  {chatbot.name}와 대화를 시작해보세요!
                </div>
                <div style={{ fontSize: "0.9rem" }}>
                  궁금한 것을 자유롭게 물어보세요.
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: "flex",
                    justifyContent: message.role === "user" ? "flex-end" : "flex-start"
                  }}
                >
                  <div style={{
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: 16,
                    background: message.role === "user" ? "#2563eb" : "rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: "0.95rem",
                    lineHeight: 1.4
                  }}>
                    <div style={{ 
                      marginBottom: 4,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}>
                      {message.content.split('**').map((part, index) => {
                        // 짝수 인덱스는 일반 텍스트, 홀수 인덱스는 볼드 텍스트
                        return index % 2 === 0 ? (
                          part
                        ) : (
                          <strong key={index} style={{ fontWeight: 'bold' }}>
                            {part}
                          </strong>
                        );
                      })}
                    </div>
                    <div style={{
                      fontSize: "0.75rem",
                      color: message.role === "user" ? "rgba(255,255,255,0.7)" : "#a3bffa",
                      textAlign: "right"
                    }}>
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isSending && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "12px 16px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.1)",
                  color: "#c3cbe7",
                  fontSize: "0.95rem"
                }}>
                  답변을 생성하는 중...
                </div>
              </div>
            )}
          </div>

          {/* 입력 영역 */}
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            gap: 12
          }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="메시지를 입력하세요..."
              disabled={isSending}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "1rem"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isSending}
              style={{
                background: inputMessage.trim() && !isSending ? "#2563eb" : "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "10px 20px",
                fontWeight: "bold",
                cursor: inputMessage.trim() && !isSending ? "pointer" : "not-allowed"
              }}
            >
              전송
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ChatbotDetail; 