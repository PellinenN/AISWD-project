import React from 'react';
import "./DiaryStyleSheet.css";

function Popup({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="sidebar-popup" onClick={onClose}>
      <div className="sidebar-popup-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Popup;