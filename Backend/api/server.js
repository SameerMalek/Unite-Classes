import express, { json } from "express";
import { connect, Schema, model } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Load environment variables
dotenv.config();

// Fix for ES Modules to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(json());

// MongoDB Connection
connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if the connection fails
  });

// Schemas and Models
const fileSchema = new Schema({
  fileName: String,
  fileUrl: String,
  className: String,
  subject: String,
  category: String,
  uploadedAt: { type: Date, default: Date.now },
});

const categorySchema = new Schema({
  type: String,
  files: [fileSchema],
});

const subjectSchema = new Schema({
  name: String,
  categories: [categorySchema],
});

const classSchema = new Schema({
  className: String,
  subjects: [subjectSchema],
});

const File = model("File", fileSchema);
const Class = model("Class", classSchema);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// API Endpoints
// Get all classes

app.get("/api/classes", async (req, res) => {
  try {
    const classes = await Class.find(); // Fetch all documents
    if (!classes.length) {
      return res.status(404).json({ message: "No classes found" });
    }
    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Error fetching classes", error: error.message });
  }
});

// Get subjects and categories for a specific class
app.get("/api/classes/:classId", async (req, res) => {
  const { classId } = req.params;
  try {
    const classData = await Class.findById(classId); // Ensure class data is returned fully
    if (classData) {
      res.json(classData); // Return full class data, including subjects and categories
    } else {
      res.status(404).json({ message: "Class not found" });
    }
  } catch (error) {
    console.error("Error fetching class data:", error);
    res.status(500).json({ message: "Error fetching class data", error: error.message });
  }
});
// Backend route to fetch subject categories
app.get("/api/classes/:classId/subjects/:subjectName", async (req, res) => {
  const { classId, subjectName } = req.params;

  try {
    const classData = await Class.findById(classId); // Fetch class data using the class ID
    if (classData) {
      // Find the subject by name
      const subjectData = classData.subjects.find(subject => subject.name === subjectName);

      if (subjectData) {
        // Return subject data with categories
        res.json(subjectData);
      } else {
        return res.status(404).json({ message: "Subject not found" });
      }
    } else {
      return res.status(404).json({ message: "Class not found" });
    }
  } catch (error) {
    console.error("Error fetching subject data:", error);
    res.status(500).json({ message: "Failed to fetch subject data", error: error.message });
  }
});

// Fetch categories for a specific subject in a class
app.get("/api/classes/:classId/subjects/:subjectName/categories", async (req, res) => {
  const { classId, subjectName } = req.params;
  try {
    const classData = await Class.findById(classId); // Fetch the class by ID
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find the subject by name
    const subjectData = classData.subjects.find(
      (subject) => subject.name === subjectName
    );

    if (!subjectData) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(subjectData.categories); // Return the categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
});

// Fetch files for a specific category
app.get("/api/classes/:classId/subjects/:subjectName/categories/:categoryType", async (req, res) => {
  const { classId, subjectName, categoryType } = req.params;

  try {
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const subjectData = classData.subjects.find((subject) => subject.name === subjectName);
    if (!subjectData) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const categoryData = subjectData.categories.find((category) => category.type === categoryType);
    if (!categoryData) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(categoryData);
  } catch (error) {
    console.error("Error fetching files for category:", error.message);
    res.status(500).json({ message: "Failed to fetch files for category", error: error.message });
  }
});

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Routes
// Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res.json({ token, message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Fetch Files
app.get("/api/admin/files", authenticateAdmin, async (req, res) => {
  try {
    const files = await File.find();
    const formattedFiles = files.map(file => ({
      id: file._id,
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      className: file.className,
      subject: file.subject,
      category: file.category,
      uploadedAt: file.uploadedAt
    }));
    res.json(formattedFiles);
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).json({ message: "Error fetching files", error: error.message });
  }
});

// Upload File
app.post("/api/admin/upload", authenticateAdmin, upload.single("file"), async (req, res) => {
  const { className, subject, category } = req.body;
  const file = req.file;

  if (!file || !className || !subject || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  const newFile = new File({
    fileName: file.originalname,
    fileUrl,
    className,
    subject,
    category,
  });

  try {
    await newFile.save();
    res.status(201).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Error saving file", error });
  }
});

// Update File
app.put("/api/admin/files/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { className, subject, category } = req.body;

  try {
    const updatedFile = await File.findByIdAndUpdate(
      id,
      { className, subject, category },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    res.status(500).json({ message: "Error updating file", error });
  }
});

// Delete File
app.delete("/api/admin/files/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const file = await File.findByIdAndDelete(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "uploads", path.basename(file.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error });
  }
});

// Static File Serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
