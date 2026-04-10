import "dotenv/config"
import express from 'express';
import morgan from 'morgan';
import indexRoutes from "./routes/index.routes.js"
import { connectDB } from './utils/db.js';

connectDB()

const app = express();

app.use(morgan("dev"))
app.use(indexRoutes)

const PORT = 8000;

app.listen(PORT, () => console.log("http://localhost:" + PORT))