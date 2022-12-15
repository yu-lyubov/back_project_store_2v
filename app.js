import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initDb } from './src/config/db_model/index.js';
import router from './src/modules/routes/index.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

initDb((err) => {
  if (err) {
    return console.log(err);
  }

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
