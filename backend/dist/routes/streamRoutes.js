"use strict";
// src/routes/streamRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const streamController_1 = __importDefault(require("../controllers/streamController"));
const router = (0, express_1.Router)();
// Streaming data route
router.get('/', streamController_1.default.getStreamingData);
exports.default = router;
