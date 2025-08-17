import React from "react";
import { motion } from "framer-motion";
import robothuman from "./robothuman.png";

function FloatingCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2 }}
      style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }}
    >
      {/* robothuman.png 이미지 카드 */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "50%", top: "10%",
          background: "rgba(255,255,255,0.85)", borderRadius: 20, boxShadow: "0 4px 24px #2563eb33",
          padding: 0, minWidth: 120, minHeight: 120,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <img src={robothuman} alt="robothuman" style={{ width: 90, height: 90, borderRadius: 16 }} />
      </motion.div>
      {/* 메인 카드 (중앙 정렬) */}
      <motion.div
        initial={{ y: 5 }}
        animate={{ y: [-16, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "38%", top: "45%", background: "rgba(30,40,60,0.55)",
          borderRadius: 18, boxShadow: "0 8px 32px #0003", padding: "18px 32px", color: "#fff",
          backdropFilter: "blur(8px)", minWidth: 260, textAlign: "center"
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 20 }}>Make your own AI Chatbot</span>
        </div>
        <div style={{ fontWeight: 400, fontSize: 14, color: "#b5cfff" }}>Your idea, Our AI</div>
        {/* Idea of your own, Idea for everyone */}
      </motion.div>
      {/* 새로운 아이디어 카드 */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "65%", top: "60%",
          background: "rgba(255,255,255,0.9)", borderRadius: 16, boxShadow: "0 4px 24px #2563eb33",
          padding: "16px 28px", minWidth: 160, textAlign: "center"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18, color: "#2563eb" }}>새로운 아이디어</div>
        <div style={{ fontWeight: 400, fontSize: 13, color: "#555" }}>떠오르는 중 ✨</div>
      </motion.div>
      {/* 빠른 응답 카드 */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "20%", top: "70%",
          background: "rgba(30,40,60,0.7)", borderRadius: 16, boxShadow: "0 4px 24px #0003",
          padding: "16px 24px", minWidth: 180, color: "#fff", textAlign: "center"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16 }}>빠른 응답</div>
        <div style={{ fontWeight: 400, fontSize: 13, color: "#b5cfff" }}>정확한 결과 ⚡</div>
      </motion.div>
    </motion.div>
  );
}

export default FloatingCards; 