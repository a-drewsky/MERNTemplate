//import packages
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

//import routes
import userRouter from './routers/userRouter.js'
import contentRouter from './routers/contentRouter.js'

//configuration
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({ 
   origin: ["http://localhost:3000"],
   credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.listen(PORT, () => console.log(`server running on port ${PORT}`));

//mongoose connection
mongoose.connect(process.env.MDB_CONNECTION_STR, 
   {useNewUrlParser: true, useUnifiedTopology: true}, 
   (error) => {
      if(error) return console.error(error);
      console.log("Connected to mongoDB");
   }
);

//routes
app.use('/user', userRouter);
app.use('/content', contentRouter);