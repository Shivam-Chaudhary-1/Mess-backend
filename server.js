import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import studentRouter from './routes/studentRoutes.js';
import globalAdminRouter from './routes/globalAdminRoutes.js';
import cors from 'cors';
import hostelAdminRouter from './routes/hostelAdminRoutes.js';
import gateAdminRouter from './routes/gateAdminRoutes.js';

dotenv.config();

const port=process.env.PORT || 3000;

const app = express();
// app.use(cors());
app.use(cors({origin:'http://localhost:5173', credentials:true}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/global-admin', globalAdminRouter);
app.use('/api/v1/hostel-admin', hostelAdminRouter);
app.use('/api/v1/gate-admin', gateAdminRouter);


connectDB();


app.get('/', (req, res)=>{
      res.send("Hello welcome!");
})

app.listen(port, ()=>{
    console.log(`server is running on port : ${port}...`)
})