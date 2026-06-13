"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const courses_1 = __importDefault(require("./routes/courses"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const applications_1 = __importDefault(require("./routes/applications"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Standard Middlewares
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static uploads
const uploadsPath = path_1.default.resolve(__dirname, 'uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/courses', courses_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/applications', applications_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong on the server.' });
});
// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Relaunch Her Backend running on http://localhost:${PORT}`);
    console.log(`📁 Uploads served statically at http://localhost:${PORT}/uploads`);
});
