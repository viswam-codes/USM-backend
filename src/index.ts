import express,{Application} from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import { registerRoutes } from './interface-adapters/userController/userRoutes';
import cors from 'cors';
import cookieParser from "cookie-parser";

dotenv.config();

const app:Application = express();
  




app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,
  }));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
  

//connecting to mongodb
connectDB();

registerRoutes(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
