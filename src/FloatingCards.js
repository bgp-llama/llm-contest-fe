import React from "react";
import { motion } from "framer-motion";
import robothuman from "./super.png";

function FloatingCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2 }}
      style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }}
    >
      {/* super.png 이미지 카드 */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "50%", top: "10%",
          background: "rgba(255, 255, 255, 0)", borderRadius: 20, 
          padding: 0, minWidth: 120, minHeight: 120,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <img src={robothuman} alt="robothuman" style={{ width: 160, height: 160, borderRadius: 16, opacity: 0.8 }} />
      </motion.div>
      {/* 작은 카드 1: 학교동선봇(지름길) */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "63%", top: "45%",
          background: "rgba(255,255,255,0.9)", borderRadius: 16, boxShadow: "0 4px 24px #2563eb33",
          padding: "16px 28px", minWidth: 180, textAlign: "center"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16, color: "black" }}>학교 동선 봇 (지름길)</div>
        <div style={{ fontWeight: 400, fontSize: 13, color: "#555" }}>건물 간 최단 동선 추천</div>
      </motion.div>
      {/* 작은 카드 2: 학과별 챗봇 */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "20%", top: "60%",
          background: "rgba(30,40,60,0.7)", borderRadius: 16, boxShadow: "0 4px 24px #0003",
          padding: "16px 24px", minWidth: 180, color: "#fff", textAlign: "center"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16 }}>학과별 챗봇</div>
        <div style={{ fontWeight: 400, fontSize: 13, color: "#b5cfff" }}>전공 맞춤 Q&A</div>
      </motion.div>

      {/* 작은 카드 3: 꿀교양 */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "60%", top: "65%",
          background: "rgba(255,255,255,0.95)", borderRadius: 16, boxShadow: "0 4px 24px #2563eb22",
          padding: "14px 22px", minWidth: 140, textAlign: "center"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>꿀교양</div>
        <div style={{ fontWeight: 400, fontSize: 12, color: "#334155" }}>후기 기반 추천</div>
      </motion.div>

      {/* 작은 카드 4: 학사일정 봇 */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "40%", top: "85%",
          background: "rgba(255,255,255,0.92)", borderRadius: 16, boxShadow: "0 4px 24px #0002",
          padding: "14px 22px", minWidth: 170, textAlign: "center"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>학사일정 봇</div>
        <div style={{ fontWeight: 400, fontSize: 12, color: "#334155" }}>학사·수업 일정 확인</div>
      </motion.div>

      {/* 작은 카드 4: 필수수업 챗봇 */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute", left: "28%", top: "40%",
          background: "rgba(30,40,60,0.75)", borderRadius: 16, boxShadow: "0 4px 24px #0004",
          padding: "14px 22px", minWidth: 180, color: "#fff", textAlign: "center"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16 }}>필수 수업 챗봇</div>
        <div style={{ fontWeight: 400, fontSize: 12, color: "#b5cfff" }}>필수 이수 과목 안내</div>
      </motion.div>
    </motion.div>
  );
}

export default FloatingCards; 