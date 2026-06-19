import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import Resume from './models/resume.js';
import connectDB from './config/mongo.config.js';
import resumeRoutes from './routes/resumeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use('/api/admin', adminRoutes);
app.use('/api/resumes', resumeRoutes);

app.get('/test-env', (req, res) => {
    res.json({
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        keyLength: process.env.OPENAI_API_KEY?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Resume Builder API is running!' });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false,
        message: err.message || "Internal Server Error" 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`OpenAI API Key present: ${!!process.env.OPENAI_API_KEY}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});

async function createDefaultResume() {
    try {
        const existingResume = await Resume.findOne();

        if (!existingResume) {
            await Resume.create({
                skills: [],
                education: [],
                experience: [],
                projects: []
            });

            console.log('Default resume created');
        } else {
            console.log('Resume already exists');
        }
    } catch (error) {
        console.error('Error creating default resume:', error);
    }
}

createDefaultResume();