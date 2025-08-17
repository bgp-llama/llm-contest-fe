import React from "react";
import { motion } from "framer-motion";
import "./FloatingBackground.css";

function FloatingBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.1 }}
      className="floating-bg"
    >
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
    </motion.div>
  );
}

export default FloatingBackground; 