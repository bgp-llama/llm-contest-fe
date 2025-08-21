import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./Navigation";
import FloatingBackground from "./FloatingBackground";
import FloatingCards from "./FloatingCards";
import "./App.css";
import "./FloatingBackground.css";
import super4 from "./super4.png";

// 프로필 원형 그라데이션과 배경 버블 컬러 팔레트
const GRADIENT_THEMES = [
  {
    profile: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    blobs: ["#8b5cf6", "#ec4899", "#06b6d4"],
  },
  {
    profile: "linear-gradient(135deg, #34d399 0%, #10b981 50%, #06b6d4 100%)",
    blobs: ["#34d399", "#60a5fa", "#f59e0b"],
  },
  {
    profile: "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)",
    blobs: ["#f59e0b", "#ef4444", "#ec4899"],
  },
  {
    profile: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #8b5cf6 100%)",
    blobs: ["#22d3ee", "#3b82f6", "#8b5cf6"],
  },
  {
    profile: "linear-gradient(135deg, #84cc16 0%, #10b981 50%, #22d3ee 100%)",
    blobs: ["#84cc16", "#10b981", "#22d3ee"],
  },
  {
    profile: "linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #6366f1 100%)",
    blobs: ["#a855f7", "#6366f1", "#14b8a6"],
  },
];

function HomePage() {
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  // 랜덤 그라데이션 테마 상태 (챗봇 변경 시 갱신)
  const [themeIndex, setThemeIndex] = useState(0);
  const [profileKey, setProfileKey] = useState(0); // 프로필 그라데이션 크로스페이드 키
  const theme = GRADIENT_THEMES[themeIndex];

  // 동일 챗봇이면 상태 변경하지 않도록 가드
  const updateSelectedChatbotIfChanged = (id, name) => {
    setSelectedChatbot((prev) => {
      if (!prev || prev.id !== id || prev.name !== name) {
        return { id, name };
      }
      return prev;
    });
  };

  useEffect(() => {
    if (!selectedChatbot) return;
    let next = Math.floor(Math.random() * GRADIENT_THEMES.length);
    if (next === themeIndex) next = (next + 1) % GRADIENT_THEMES.length;
    setThemeIndex(next);
    setProfileKey((k) => k + 1); // 키 변경으로 프로필 그라데이션 부드럽게 교체
  }, [selectedChatbot]);

    const handleRecommend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      setShowError(false);
      setIsLoading(true);

      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        if (baseUrl) {
          // 1. /invoke API 호출 - 자연어 명령 처리
          console.log("Invoke API 호출:", `${baseUrl}/invoke`);
          const invokeResponse = await fetch(`${baseUrl}/invoke`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: input
            })
          });

            if (invokeResponse.ok) {
              const invokeData = await invokeResponse.json();
              const chatbotId = parseInt(invokeData.response, 10);
              console.log("Invoke 응답:", invokeData);

              // 2. GET /chatbots/{chatbot_id} API 호출 - 챗봇 정보 가져오기
              console.log("챗봇 정보 API 호출:", `${baseUrl}/chatbots/${chatbotId}`);
              const chatbotResponse = await fetch(`${baseUrl}/chatbots/${chatbotId}`);
              
              let chatbotName = "슈퍼챗봇";
              if (chatbotResponse.ok) {
                const chatbotData = await chatbotResponse.json();
                console.log("챗봇 정보:", chatbotData);
                chatbotName = chatbotData.name || "슈퍼챗봇";
              }

              // 3. /chat/quick API 호출 - 빠른 챗봇 대화
              console.log("Chat Quick API 호출:", `${baseUrl}/chat/quick`);
              const chatResponse = await fetch(`${baseUrl}/chat/quick`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  message: input,
                  chatbot_id: chatbotId
                })
              });

            if (chatResponse.ok) {
              const chatData = await chatResponse.json();
              console.log("Chat Quick 응답:", chatData);

              // 응답 메시지 설정
              const responseMessage = chatData.message || invokeData.response || "AI가 요청을 처리했습니다.";
              
              updateSelectedChatbotIfChanged(chatbotId, chatbotName);
              setMessages([
                {
                  id: Date.now(),
                  content: input,
                  role: "user",
                  created_at: new Date()
                },
                {
                  id: Date.now() + 1,
                  content: responseMessage,
                  role: "assistant",
                  chatbot_name: chatbotName,
                  created_at: new Date()
                }
              ]);
              setShowChat(true);
            } else {
              throw new Error("챗봇 대화 API 호출에 실패했습니다.");
            }
          } else {
            throw new Error("자연어 처리 API 호출에 실패했습니다.");
          }
        } else {
          // API 서버 미설정 시 로컬 시뮬레이션
          let chatbotName = "슈퍼챗봇";
          if (input.includes("학사") || input.includes("일정") || input.includes("학기")) {
            chatbotName = "학사일정 챗봇";
          } else if (input.includes("번역") || input.includes("translate")) {
            chatbotName = "번역 챗봇";
          } else if (input.includes("수학") || input.includes("계산")) {
            chatbotName = "수학 학습 챗봇";
          } else if (input.includes("영화") || input.includes("추천")) {
            chatbotName = "영화 추천 챗봇";
          }
          
          updateSelectedChatbotIfChanged(1, chatbotName);
          setMessages([
            {
              id: Date.now(),
              content: input,
              role: "user",
              created_at: new Date()
            },
            {
              id: Date.now() + 1,
              content: `"${input}"에 대한 도움을 드리기 위해 AI가 요청을 처리했습니다.`,
              role: "assistant",
              chatbot_name: chatbotName,
              created_at: new Date()
            }
          ]);
          setShowChat(true);
        }
      } catch (error) {
        console.error("AI 실행 실패:", error);
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      role: "user",
      created_at: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);

    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      if (baseUrl) {
        // 1. POST /invoke API 호출 - 자연어 명령 처리
        console.log("Invoke API 호출:", `${baseUrl}/invoke`);
        const invokeResponse = await fetch(`${baseUrl}/invoke`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage
          })
        });

        if (invokeResponse.ok) {
          const invokeData = await invokeResponse.json();
          const chatbotId = parseInt(invokeData.response, 10);
          console.log("Invoke 응답:", invokeData);

          // 2. GET /chatbots/{chatbot_id} API 호출 - 챗봇 정보 가져오기
          console.log("챗봇 정보 API 호출:", `${baseUrl}/chatbots/${chatbotId}`);
          const chatbotResponse = await fetch(`${baseUrl}/chatbots/${chatbotId}`);
          
          let chatbotName = "슈퍼챗봇";
          if (chatbotResponse.ok) {
            const chatbotData = await chatbotResponse.json();
            console.log("챗봇 정보:", chatbotData);
            chatbotName = chatbotData.name || "슈퍼챗봇";
          }

          // 3. POST /chat/quick API 호출 - 빠른 챗봇 대화
          console.log("Chat Quick API 호출:", `${baseUrl}/chat/quick`);
          const chatResponse = await fetch(`${baseUrl}/chat/quick`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: inputMessage,
              chatbot_id: chatbotId
            })
          });

          if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log("Chat Quick 응답:", chatData);

            // 응답 메시지 설정
            const responseMessage = chatData.message || invokeData.response || "AI가 요청을 처리했습니다.";

            // 선택된 챗봇이 실제 변경된 경우에만 업데이트
            updateSelectedChatbotIfChanged(chatbotId, chatbotName);

            const botResponse = {
              id: Date.now() + 1,
              content: responseMessage,
              role: "assistant",
              chatbot_name: chatbotName,
              created_at: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
          } else {
            throw new Error("챗봇 대화 API 호출에 실패했습니다.");
          }
        } else {
          throw new Error("자연어 처리 API 호출에 실패했습니다.");
        }
      } else {
        // API 서버 미설정 시 시뮬레이션
        setTimeout(() => {
          const botResponse = {
            id: Date.now() + 1,
            content: `안녕하세요! 슈퍼챗봇입니다. "${inputMessage}"에 대해 도움을 드리겠습니다.`,
            role: "assistant",
            chatbot_name: selectedChatbot?.name || "슈퍼챗봇",
            created_at: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
        }, 1000);
      }
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "죄송합니다. 메시지 전송에 실패했습니다.",
        role: "assistant",
        created_at: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleBackToHome = () => {
    // 챗봇 인터페이스가 사라지는 애니메이션
    setShowChat(false);
    
    // 상태 초기화 (애니메이션 완료 후)
    setTimeout(() => {
      setSelectedChatbot(null);
      setMessages([]);
      setInputMessage("");
      setInput("");
    }, 500); // 애니메이션 duration과 맞춤
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };



    return (
    <>
      {/* Hero(인트로) 영역 - 딥블루 그라데이션 배경 */}
      <div style={{
        minHeight: "100vh", position: "relative",
        background: "linear-gradient(120deg, #050a12, #0f1a24 80%)",
        color: "#fff",
        fontFamily: "Pretendard, sans-serif"
      }}>
        <Navigation />

        <AnimatePresence mode="wait">
          {!showChat ? (
            /* 메인 컨텐츠 */
            <motion.div
              key="main-content"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ 
                opacity: 0,
                x: -100,
                transition: { duration: 0.5, ease: "easeInOut" }
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                maxWidth: 1200, margin: "0 auto", marginTop: 38, padding: "0 60px",
                position: "relative", minHeight: 500
              }}
            >
                             {/* 좌측 텍스트 */}
               <motion.div 
                 style={{ flex: 1, minWidth: 350 }}
                 initial={{ opacity: 0, x: -200 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ 
                   x: -200,
                   transition: { duration: 0.5, ease: "easeInOut" }
                 }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
               >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{
                    background: "#222a36", color: "#a3bffa", display: "inline-block",
                    padding: "6px 22px", borderRadius: 18, fontWeight: 600, fontSize: "1.05rem", marginBottom: 24
                  }}
                >
                  원하는 챗봇을 바로 찾으세요
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.2, margin: 0 }}
                >
                  무엇을 도와드릴까요?<br />
                  <span style={{
                    background: "linear-gradient(45deg, #fff,rgb(145, 95, 231))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>슈퍼차차</span>가 알아서 처리해드릴게요
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.1 }}
                  style={{ fontSize: "1.2rem", color: "#c3cbe7", margin: "24px 0 40px 0", lineHeight: 1.6 }}
                >
                  복잡한 챗봇 설정 없이, 원하는 작업만 말씀하세요.<br />
                  자동으로 최적의 챗봇을 찾아 실행합니다.
                </motion.p>
                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.4 }}
                  onSubmit={handleRecommend}
                  style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 500 }}
                >
                  <div style={{ display: "flex", gap: 12 }}>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        if (showError) setShowError(false);
                      }}
                      placeholder="예 : 학사일정을 알고싶어요"
                      style={{
                        flex: 1,
                        padding: "16px 20px",
                        borderRadius: 12,
                        border: showError ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        fontSize: "1rem",
                        backdropFilter: "blur(10px)"
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      style={{
                        background: input.trim() && !isLoading ? "#2563eb" : "rgba(255,255,255,0.1)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "16px 32px",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {isLoading ? "챗봇을 불러오는 중..." : "슈퍼차차로 실행하기"}
                    </button>
                  </div>
                  {showError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        color: "#ef4444",
                        fontSize: "0.9rem",
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                      }}
                    >
                      <span>⚠️</span>
                      작업을 입력해주세요.
                    </motion.div>
                  )}
                </motion.form>
              </motion.div>

                             {/* 우측 플로팅 요소들 */}
               <motion.div 
                 style={{ flex: 1, position: "relative", height: 500 }}
                 initial={{ opacity: 0, x: 200 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ 
                   x: 200,
                   transition: { duration: 0.5, ease: "easeInOut" }
                 }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
               >
                <FloatingBackground />
                <FloatingCards />
              </motion.div>
            </motion.div>
          ) : (
                         /* 챗봇 인터페이스 */
             <motion.div
               key="chat-interface"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ 
                 opacity: 0, 
                 scale: 0.9,
                 transition: { duration: 0.5, ease: "easeInOut" }
               }}
               transition={{ duration: 0.5, delay: 0.3 }}
                               style={{
                  maxWidth: 1400, margin: "0 auto", padding: "40px 60px 40px 60px",
                  display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40,
                  minHeight: "calc(100vh - 120px)"
                }}
             >
                {/* 왼쪽: 슈퍼챗봇 플로팅 배경 */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{
                    position: "relative",
                    height: "fit-content",
                    maxHeight: "calc(100vh - 200px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px"
                  }}
                >
                  {/* 슈퍼챗방용 커스텀 플로팅 배경 */}
                  <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    zIndex: 1
                  }}>
                    <motion.div style={{
                      position: "absolute",
                      width: 240,
                      height: 240,
                      borderRadius: "50%",
                      top: "15%",
                      left: "20%",
                      filter: "blur(60px)",
                      opacity: 0.8,
                      animation: "moveBlob 12s infinite alternate ease-in-out"
                    }}
                    animate={{ backgroundColor: theme.blobs[0] }}
                    transition={{ duration: 0.8, ease: "easeInOut" }} />

                    <motion.div style={{
                      position: "absolute",
                      width: 240,
                      height: 240,
                      borderRadius: "50%",
                      top: "45%",
                      left: "35%",
                      filter: "blur(60px)",
                      opacity: 0.7,
                      animation: "moveBlob 12s infinite alternate ease-in-out 2s"
                    }}
                    animate={{ backgroundColor: theme.blobs[1] }}
                    transition={{ duration: 0.8, ease: "easeInOut" }} />

                    <motion.div style={{
                      position: "absolute",
                      width: 240,
                      height: 240,
                      borderRadius: "50%",
                      top: "65%",
                      left: "15%",
                      filter: "blur(60px)",
                      opacity: 0.6,
                      animation: "moveBlob 12s infinite alternate ease-in-out 4s"
                    }}
                    animate={{ backgroundColor: theme.blobs[2] }}
                    transition={{ duration: 0.8, ease: "easeInOut" }} />
                  </div>
                  
                  {/* 컨텐츠 */}
                  <div style={{
                    position: "relative",
                    zIndex: 3,
                    color: "#fff",
                    textAlign: "center"
                  }}>
                    {/* 선택된 챗봇 프로필 */}
                    {selectedChatbot ? (
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ width: 80, height: 80, margin: "0 auto 12px auto", position: "relative" }}>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={profileKey}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                              style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "50%",
                                background: theme.profile,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 32,
                                fontWeight: "bold",
                                color: "#fff",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                              }}
                            >
                              {selectedChatbot.name.charAt(0)}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <h3 style={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          margin: 0,
                          color: "#e0e7ff"
                        }}>
                          {selectedChatbot.name}
                        </h3>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                        <h1 style={{ 
                          fontSize: "1.6rem", 
                          fontWeight: 700, 
                          marginBottom: 12,
                          background: "linear-gradient(45deg, #fff, #e0e7ff)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        }}>
                          슈퍼챗봇
                        </h1>
                      </>
                    )}
                    <p style={{ 
                      color: "#e0e7ff", 
                      fontSize: "0.9rem", 
                      lineHeight: 1.5,
                      marginBottom: 30,
                      fontWeight: 400
                    }}>
                      당신의 요청에 맞는 최적의 챗봇을 자동으로 선택합니다
                    </p>

                    {/* 슈퍼챗봇 특징 */}
                    <div style={{ marginBottom: 30 }}>
                      <div style={{ 
                        display: "grid", 
                        gap: 16,
                        textAlign: "left"
                      }}>
                        <div style={{
                          background: "rgba(255,255,255,0.1)",
                          padding: "16px",
                          borderRadius: 12,
                          backdropFilter: "blur(10px)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                            <div style={{ fontSize: 20, marginRight: 8 }}>🎯</div>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>
                              스마트 매칭
                            </h3>
                          </div>
                          <p style={{ color: "#e0e7ff", fontSize: "0.8rem", lineHeight: 1.4, margin: 0 }}>
                            입력한 작업에 가장 적합한 챗봇을 자동으로 찾아드립니다
                          </p>
                        </div>
                        
                        <div style={{
                          background: "rgba(255,255,255,0.1)",
                          padding: "16px",
                          borderRadius: 12,
                          backdropFilter: "blur(10px)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                            <div style={{ fontSize: 20, marginRight: 8 }}>⚡</div>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>
                              즉시 실행
                            </h3>
                          </div>
                          <p style={{ color: "#e0e7ff", fontSize: "0.8rem", lineHeight: 1.4, margin: 0 }}>
                            별도 설정 없이 바로 대화를 시작할 수 있습니다
                          </p>
                        </div>
                        
                        <div style={{
                          background: "rgba(255,255,255,0.1)",
                          padding: "16px",
                          borderRadius: 12,
                          backdropFilter: "blur(10px)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                            <div style={{ fontSize: 20, marginRight: 8 }}>🔮</div>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>
                              지능형 분석
                            </h3>
                          </div>
                          <p style={{ color: "#e0e7ff", fontSize: "0.8rem", lineHeight: 1.4, margin: 0 }}>
                            복잡한 요청도 정확히 이해하고 최적의 솔루션을 제공합니다
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleBackToHome}
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: 12,
                        padding: "12px 24px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease",
                        backdropFilter: "blur(10px)"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(255,255,255,0.3)";
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(255,255,255,0.2)";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      🏠 홈으로 돌아가기
                    </button>
                  </div>
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
                   height: "100%"
                 }}
              >
                {/* 대화 헤더 */}
                <div style={{
                  padding: "24px 32px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 600, margin: 0, position: "relative", zIndex: 1 }}>
                      슈퍼차차와 대화하기
                    </h2>
                    <img
                      src={super4}
                      alt="super4"
                      style={{
                        position: "absolute",
                        left: "100%",
                        marginLeft: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 120,
                        height: "auto",
                        opacity: 0.6,
                        pointerEvents: "none",
                        zIndex: 0
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setMessages([])}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
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
                  maxHeight: "calc(100vh - 300px)",
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
                        슈퍼챗봇과 대화를 시작해보세요!
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
                          {/* 챗봇 이름 표시 (assistant 메시지에만) */}
                          {message.role === "assistant" && message.chatbot_name && (
                            <div style={{
                              fontSize: "0.8rem",
                              color: "#a3bffa",
                              marginBottom: 6,
                              fontWeight: 600
                            }}>
                              {message.chatbot_name}
                            </div>
                          )}
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
                  padding: "24px 32px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  gap: 12
                }}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="메시지를 입력하세요..."
                    disabled={isSending}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "1rem"
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isSending}
                    style={{
                      background: inputMessage.trim() && !isSending ? "#2563eb" : "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 24px",
                      fontWeight: "bold",
                      cursor: inputMessage.trim() && !isSending ? "pointer" : "not-allowed"
                    }}
                  >
                    전송
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      

       {/* 서비스 특징 섹션 - 챗봇 모드가 아닐 때만 표시 */}
       {!showChat && (
         <section id="feature-section" style={{ 
           minHeight: "100vh", 
           background: "linear-gradient(120deg, #050a12, #0f1a24 80%)", 
           padding: "80px 0",
           color: "#fff"
         }}>
           <motion.h2
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true, amount: 0.5 }}
             style={{ textAlign: "center", fontSize: "2rem", marginBottom: 40, color: "#fff" }}
           >
             챗봇 서비스 특징
           </motion.h2>
           <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.1 }}
               viewport={{ once: true, amount: 0.5 }}
               style={{ minWidth: 220, textAlign: "center" }}
             >
               <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
               <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#fff" }}>AI 챗봇 생성</div>
               <div style={{ color: "#c3cbe7", fontSize: 15 }}>누구나 쉽게 맞춤형 챗봇을 만들 수 있습니다.</div>
             </motion.div>
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               viewport={{ once: true, amount: 0.5 }}
               style={{ minWidth: 220, textAlign: "center" }}
             >
               <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
               <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#fff" }}>즉시 배포</div>
               <div style={{ color: "#c3cbe7", fontSize: 15 }}>만든 챗봇을 바로 공유하고 사용할 수 있습니다.</div>
             </motion.div>
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.5 }}
               viewport={{ once: true, amount: 0.5 }}
               style={{ minWidth: 220, textAlign: "center" }}
             >
               <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
               <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#fff" }}>안전한 데이터</div>
               <div style={{ color: "#c3cbe7", fontSize: 15 }}>모든 대화와 정보는 안전하게 보호됩니다.</div>
             </motion.div>
           </div>
         </section>
       )}
    </>
  );
}

export default HomePage; 