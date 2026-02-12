import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (_, file, cb) => {
    // Sanitize: replace spaces and special chars so the filename is URL-safe
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, Date.now() + "-" + safe);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) cb(null, true);
    else cb(new Error("Only images & PDFs"));
  },
});