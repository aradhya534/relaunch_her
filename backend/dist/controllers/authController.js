"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const JWT_SECRET = process.env.JWT_SECRET || 'relaunch_her_super_secret_jwt_key_2026_investor_mvp';
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields (name, email, password, role) are required.' });
        }
        if (role !== 'RETURNER' && role !== 'EMPLOYER') {
            return res.status(400).json({ error: 'Invalid role. Must be RETURNER or EMPLOYER.' });
        }
        const existingUser = await client_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await client_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                // Proactively seed a default profile if the user is a returner
                ...(role === 'RETURNER' ? {
                    profile: {
                        create: {
                            skills: [],
                            gapYears: 0,
                            gapReason: '',
                            availability: '',
                            skillScore: 0,
                        },
                    },
                } : {}),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user,
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'Internal server error during registration.' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        const user = await client_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error during login.' });
    }
};
exports.login = login;
