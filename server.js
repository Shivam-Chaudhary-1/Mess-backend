import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import studentRouter from './routes/studentRoutes.js';
import globalAdminRouter from './routes/globalAdminRoutes.js';

dotenv.config();

const port=process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/global-admin', globalAdminRouter);


connectDB();

app.get('/', (req, res)=>{
      res.send("Hello welcome!");
})

app.listen(port, ()=>{
    console.log(`server is running on port : ${port}...`)
})