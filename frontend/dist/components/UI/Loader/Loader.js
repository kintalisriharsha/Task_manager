"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Loader.css");
const Loader = ({ size = 'medium', fullScreen = false, message }) => {
    const loaderContent = (<>
      <div className={`loader-spinner ${size}`}></div>
      {message && <p className="loader-message">{message}</p>}
    </>);
    if (fullScreen) {
        return (<div className="loader-full-screen">
        {loaderContent}
      </div>);
    }
    return <div className="loader">{loaderContent}</div>;
};
exports.default = Loader;
