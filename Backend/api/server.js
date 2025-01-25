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
// Ensure MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(json());

// MongoDB Connection
connect(process.env.MONGODB_URI)
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
    res
      .status(500)
      .json({ message: "Error fetching classes", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error fetching class data", error: error.message });
  }
});
// Backend route to fetch subject categories
app.get("/api/classes/:classId/subjects/:subjectName", async (req, res) => {
  const { classId, subjectName } = req.params;

  try {
    const classData = await Class.findById(classId); // Fetch class data using the class ID
    if (classData) {
      // Find the subject by name
      const subjectData = classData.subjects.find(
        (subject) => subject.name === subjectName
      );

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
    res
      .status(500)
      .json({ message: "Failed to fetch subject data", error: error.message });
  }
});

// Fetch categories for a specific subject in a class
app.get(
  "/api/classes/:classId/subjects/:subjectName/categories",
  async (req, res) => {
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
      res
        .status(500)
        .json({ message: "Failed to fetch categories", error: error.message });
    }
  }
);

// Fetch files for a specific category
app.get(
  "/api/classes/:classId/subjects/:subjectName/categories/:categoryType",
  async (req, res) => {
    const { classId, subjectName, categoryType } = req.params;

    try {
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }

      const subjectData = classData.subjects.find(
        (subject) => subject.name === subjectName
      );
      if (!subjectData) {
        return res.status(404).json({ message: "Subject not found" });
      }

      const categoryData = subjectData.categories.find(
        (category) => category.type === categoryType
      );
      if (!categoryData) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(categoryData);
    } catch (error) {
      console.error("Error fetching files for category:", error.message);
      res.status(500).json({
        message: "Failed to fetch files for category",
        error: error.message,
      });
    }
  }
);

app.get("/api/classes/:classId/subjects/:subjectName/categories/:categoryType/files", async (req, res) => {
  try {
    const { classId, subjectName, categoryType } = req.params;

    // Find the specific class
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find the specific subject
    const subject = classData.subjects.find(
      (subj) => subj.name === subjectName
    );
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Find the specific category
    const category = subject.categories.find(
      (cat) => cat.type === categoryType
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Return the files array
    res.json({
      files: category.files.map(file => ({
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        uploadedAt: file.uploadedAt
      }))
    });

  } catch (error) {
    console.error("Error fetching category files:", error);
    res.status(500).json({ 
      message: "Error fetching category files", 
      error: error.message 
    });
  }
});

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error.message);
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
// File Upload Endpoint
app.post("/api/admin/upload", authenticateAdmin, upload.single('file'), async (req, res) => {
  try {
    const { className, subject, category } = req.body;
    const file = req.file;

    if (!file || !className || !subject || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find or create the class
    let classData = await Class.findOne({ className });
    if (!classData) {
      classData = new Class({ className, subjects: [] });
    }

    // Find or create the subject
    let subjectData = classData.subjects.find(s => s.name === subject);
    if (!subjectData) {
      subjectData = { name: subject, categories: [] };
      classData.subjects.push(subjectData);
    }

    // Find or create the category
    let categoryData = subjectData.categories.find(c => c.type === category);
    if (!categoryData) {
      categoryData = { type: category, files: [] };
      subjectData.categories.push(categoryData);
    }

    // Create file metadata
    const fileMetadata = {
      fileName: file.filename,
      fileUrl: `/uploads/${file.filename}`, // Adjust based on your file serving strategy
      className,
      subject,
      category
    };

    categoryData.files.push(fileMetadata);

    await classData.save();

    res.status(201).json({ 
      message: "File uploaded successfully", 
      fileUrl: fileMetadata.fileUrl 
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});
// Fetch Files
app.get("/api/admin/files", authenticateAdmin, async (req, res) => {
  try {
    // Find all classes with explicit population of nested fields
    const classes = await Class.find()
      .populate({
        path: 'subjects',
        populate: {
          path: 'categories',
          populate: {
            path: 'files'
          }
        }
      });

    // Initialize array to store all files
    const allFiles = [];

    // Debug log
    console.log('Classes found:', classes.length);

    // Safely traverse the nested structure
    for (const classObj of classes) {
      if (!classObj.subjects) continue;
      
      for (const subject of classObj.subjects) {
        if (!subject.categories) continue;
        
        // Fixed: Changed 'category' to 'categoryObj'
        for (const categoryObj of subject.categories) {
          if (!categoryObj.files) continue;
          
          for (const file of categoryObj.files) {
            allFiles.push({
              id: file._id,
              fileName: file.fileName,
              fileUrl: file.fileUrl,
              className: classObj.className,
              subject: subject.name,
              category: categoryObj.type,
              uploadedAt: file.uploadedAt
            });
          }
        }
      }
    }

    // Debug logging
    console.log(`Successfully retrieved ${allFiles.length} files`);
    
    return res.json(allFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ 
      message: "Error fetching files", 
      error: error.message 
    });
  }
});

// Delete File from Appwrite
app.delete("/api/admin/files/:fileId", authenticateAdmin, async (req, res) => {
  const { fileId } = req.params;
  const { className, subject, category } = req.query;

  try {
    const classData = await Class.findOne({ className });
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const subjectData = classData.subjects.find((subj) => subj.name === subject);
    if (!subjectData) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const categoryData = subjectData.categories.find((cat) => cat.type === category);
    if (!categoryData) {
      return res.status(404).json({ message: "Category not found" });
    }

    const fileIndex = categoryData.files.findIndex((file) => file._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileToDelete = categoryData.files[fileIndex];

    // Delete from Appwrite
    await storage.deleteFile(process.env.APPWRITE_BUCKET_ID, fileToDelete.appwriteFileId);

    // Remove metadata from MongoDB
    categoryData.files.splice(fileIndex, 1);
    await classData.save();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
