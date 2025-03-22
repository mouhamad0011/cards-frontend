import React from "react";
import "../css/popup.css";

const Popup = ({
  title,
  cancelLabel,
  confirmLabel,
  onAccept,
  onReject,
}) => {
  return (
    <div className="confirmation-popup-container">
      <a onClick={onReject} className="confirmation-popup-close" />
      <h5 className="confirmation-popup-title">{title}</h5>
      <div className="confirmation-popup-buttons">
        <button
          type="button"
          onClick={onReject}
          className="confirmation-popup-button-cancel"
        >
          {cancelLabel}
        </button>
        <button type="button" onClick={onAccept}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
};

export default Popup;