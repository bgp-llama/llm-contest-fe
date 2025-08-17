import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import chatbotIcon from "./chatbot_icon.svg";

function Navigation() {
  const location = useLocation();
  
  // 현재 페이지에 따라 활성 링크 스타일 적용
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div style={{
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      padding: "32px 60px 0 60px"
    }}>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                 <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           style={{ 
             fontWeight: "bold", 
             fontSize: "1.6rem", 
             letterSpacing: "2px",
             cursor: "pointer",
             display: "flex",
             alignItems: "center",
             gap: "8px"
           }}
         >
          <img src={chatbotIcon} alt="로고" style={{ height: 36, verticalAlign: "middle" }} />
          <span>챗봇모음</span>
        </motion.div>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ display: "flex", gap: "36px", fontSize: "1.1rem" }}
      >
        <Link 
          to="/" 
          style={{ 
            color: isActive("/") ? "#2563eb" : "#fff", 
            textDecoration: "none",
            fontWeight: isActive("/") ? "bold" : "normal"
          }}
        >
          홈
        </Link>
        <Link 
          to="/explore" 
          style={{ 
            color: isActive("/explore") ? "#2563eb" : "#fff", 
            textDecoration: "none",
            fontWeight: isActive("/explore") ? "bold" : "normal"
          }}
        >
          챗봇 탐색
        </Link>
                 <Link 
           to="/register" 
           style={{ 
             color: isActive("/register") ? "#2563eb" : "#fff", 
             textDecoration: "none",
             fontWeight: isActive("/register") ? "bold" : "normal"
           }}
         >
           챗봇 등록
         </Link>
      </motion.div>
    </div>
  );
}

export default Navigation; 