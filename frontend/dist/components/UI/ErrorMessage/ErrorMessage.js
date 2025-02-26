"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./ErrorMessage.css");
const ErrorMessage = ({ message, onRetry }) => {
    return (<div className="error-message-container">
      <div className="error-icon">
        <i className="fas fa-exclamation-circle"></i>
      </div>
      <p className="error-text">{message}</p>
      {onRetry && (<button className="error-retry-button" onClick={onRetry}>
          Retry
        </button>)}
    </div>);
};
exports.default = ErrorMessage;
