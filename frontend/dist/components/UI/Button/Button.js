"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Button.css");
const Button = ({ children, type = 'button', variant = 'primary', onClick, disabled = false, className = '', }) => {
    return (<button type={type} className={`button ${variant} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>);
};
exports.default = Button;
