import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

connectDB();
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('API is running....');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});