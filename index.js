import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from 'express';
import cors from "cors";
import morgan from 'morgan';
import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/users.routes.js";
import loginRoutes from "./routes/login.routes.js";
import { connectDB } from './utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

connectDB().catch(() => {
    console.error("The API started without a database connection.");
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(indexRoutes);
app.use(usersRoutes);
app.use(loginRoutes);

const PORT = 8000;

app.listen(PORT, () => console.log("http://localhost:" + PORT));
