require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.route');
const connectDB = require('./db/connectDB');
const { PORT, CLIENT_URL, NODE_ENV } = require('./configs/config');
const profileRouter = require('./routes/profile.route');
const adminRouter = require('./routes/admin.route');
const applicationRouter = require('./routes/application.route');
const jobRouter = require('./routes/job.route');
const cookieParser = require('cookie-parser');

const allowedOrigins = [
    "https://job-portal-application-five.vercel.app",
    "http://3.111.144.118:3000"
];

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

connectDB();

app.use(express.static("public"));

app.use('/api/auth', authRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/admin', adminRouter);
app.use('/api/applications', applicationRouter);
app.use("/api/jobs", jobRouter);

app.listen(PORT || 5000, () => console.log(`Server running on port ${PORT || 5000}`));

