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

// Upload File
app.post(
  "/api/admin/upload",
  authenticateAdmin,
  upload.single("file"),
  async (req, res) => {
    const { className, subject, category } = req.body;
    const file = req.file;

    if (!file || !className || !subject || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const fileUrl = `${protocol}://${req.get("host")}/uploads/${file.filename}`;

    try {
      const classData = await Class.findOne({ className });
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }

      const subjectData = classData.subjects.find(
        (subj) => subj.name === subject
      );
      if (!subjectData) {
        return res.status(404).json({ message: "Subject not found" });
      }

      const categoryData = subjectData.categories.find(
        (cat) => cat.type === category
      );
      if (!categoryData) {
        return res.status(404).json({ message: "Category not found" });
      }

      categoryData.files.push({ fileName: file.originalname, fileUrl });
      await classData.save();

      res.status(201).json({
        message: "File uploaded successfully",
        fileUrl,
        fileName: file.originalname,
        className,
        subject,
        category,
      });
    } catch (error) {
      console.error("Error uploading file:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
// // Update File
app.put("/api/admin/files/:fileId", authenticateAdmin, async (req, res) => {
  const { fileId } = req.params;
  const { className, subject, category, fileName } = req.body;

  try {
    // Find the class containing the file
    const classDoc = await Class.findOne({ className });
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find the subject
    const subjectDoc = classDoc.subjects.find(s => s.name === subject);
    if (!subjectDoc) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Find the category
    const categoryDoc = subjectDoc.categories.find(c => c.type === category);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find and update the file
    const fileDoc = categoryDoc.files.id(fileId);
    if (!fileDoc) {
      return res.status(404).json({ message: "File not found" });
    }

    // Update file properties
    if (fileName) fileDoc.fileName = fileName;
    
    // Save the updated document
    await classDoc.save();

    res.json({ 
      message: "File updated successfully", 
      file: {
        id: fileDoc._id,
        fileName: fileDoc.fileName,
        fileUrl: fileDoc.fileUrl,
        className,
        subject,
        category,
        uploadedAt: fileDoc.uploadedAt
      }
    });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Error updating file", error: error.message });
  }
});



// Delete Function
app.delete("/api/admin/files/:fileId", authenticateAdmin, async (req, res) => {
  const { fileId } = req.params;
  const { className, subject, category } = req.query;

  console.log("Delete Request Parameters:", { fileId, className, subject, category });

  try {
    // Find the class
    const classDoc = await Class.findOne({ className: className.trim() });
    if (!classDoc) {
      return res.status(404).json({
        message: "Class not found",
        searchedFor: className
      });
    }

    // Find the subject within the class
    const subjectIndex = classDoc.subjects.findIndex(s => s.name === subject.trim());
    if (subjectIndex === -1) {
      return res.status(404).json({
        message: "Subject not found",
        searchedFor: subject
      });
    }

    // Find the category within the subject
    const categoryIndex = classDoc.subjects[subjectIndex].categories.findIndex(
      c => c.type === category.trim()
    );
    if (categoryIndex === -1) {
      return res.status(404).json({
        message: "Category not found",
        searchedFor: category
      });
    }

    // Find the file within the category
    const fileIndex = classDoc.subjects[subjectIndex].categories[categoryIndex].files.findIndex(
      f => f._id.toString() === fileId
    );
    if (fileIndex === -1) {
      return res.status(404).json({
        message: "File not found",
        searchedFor: fileId
      });
    }

    // Get file information before deletion
    const fileToDelete = classDoc.subjects[subjectIndex].categories[categoryIndex].files[fileIndex];

    // Remove the file from the array
    classDoc.subjects[subjectIndex].categories[categoryIndex].files.splice(fileIndex, 1);

    // Save the updated document
    await classDoc.save();

    // Delete the physical file
    try {
      const filePath = path.join(__dirname, "uploads", path.basename(fileToDelete.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Physical file deleted:", filePath);
      }
    } catch (fileError) {
      console.log("Error deleting physical file:", fileError);
      // Continue even if physical file deletion fails
    }

    res.json({
      message: "File deleted successfully",
      deletedFile: {
        id: fileId,
        className,
        subject,
        category,
        fileName: fileToDelete.fileName
      }
    });

  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      message: "Error deleting file",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});// Static File Serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
