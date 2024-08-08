import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import mime from "mime";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import dossiermed from "./routes/dossierMedical.js"
import ConsultationRoutes from "./routes/Consultation.js"
import MFAroute from "./routes/MFA-verification.js";
import appointementRoutes  from"./routes/appointment.js"
import { registerUser } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
/*import { SendMail } from "./controllers/nodemailer.js";*/
import { updateUserProfile } from "./controllers/users.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Middleware to serve static files and set headers
app.use("/assets", express.static(path.join(__dirname, "public/assets"), {
  setHeaders: (res, filePath) => {
    const mimeType = mime.getType(filePath);
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
  }
}));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/api/auth/register", upload.single("picture"), registerUser);
app.post("/api/posts", verifyToken, upload.single("picture"), createPost);
app.put('/api/users/:userId/update', upload.single('picture'), updateUserProfile);

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/appointement", appointementRoutes);
app.use("/api",MFAroute);
app.use("/api/schedule",ConsultationRoutes);
app.use("/api/dm",dossiermed);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3005;
mongoose
  .connect("mongodb://127.0.0.1:27017/medilinkk", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
