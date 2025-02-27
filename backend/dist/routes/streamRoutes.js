"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// src/routes/streamRoutes.ts
const express_1 = require("express");
const streamController_1 = tslib_1.__importDefault(require("../controllers/streamController"));
const router = (0, express_1.Router)();
// Stream data route
router.get('/', streamController_1.default.getStreamingData);
exports.default = router;
//# sourceMappingURL=streamRoutes.js.map