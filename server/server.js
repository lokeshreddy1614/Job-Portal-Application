require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connectDB');

const authRouter = require('./routes/auth.route');
const profileRouter = require('./routes/profile.route');
const adminRouter = require('./routes/admin.route');
const applicationRouter = require('./routes/application.route');
const jobRouter = require('./routes/job.route');

const { PORT, CLIENT_URL, NODE_ENV } = require('./configs/config');

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

connectDB().catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit if DB connection fails
});

app.use(express.static("public"));

app.use('/api/auth', authRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/admin', adminRouter);
app.use('/api/applications', applicationRouter);
app.use("/api/jobs", jobRouter);

app.get('/', (req, res) => {
    res.send("Job Portal API is running...");
});

app.get('/test', (req, res) => {
    res.json({ message: "Test route is working!" });
});

console.log("Available Routes:");
app._router.stack.forEach(r => {
    if (r.route && r.route.path) {
        console.log(`  ${r.route.path}`);
    }
});

const port = parseInt(PORT, 10) || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));


