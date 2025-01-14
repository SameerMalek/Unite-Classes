import express, { json } from "express";
import { connect, Schema, model } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Fix for ES Modules to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(json());

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

// Define Schemas and Models
const fileSchema = new Schema({
  fileName: String,
  fileUrl: String,
  className: String,  // Add these new fields
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/')); // Ensure correct path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Modify the admin login endpoint to include more secure error handling
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      throw new Error("Admin credentials not set in environment variables.");
    }
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
      res.json({ token, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Modify the upload endpoint to save file information in both collections
app.post('/api/admin/upload', authenticateAdmin, upload.single('file'), async (req, res) => {
  try {
    const { className, subject, category } = req.body;
    const file = req.file;

    if (!file || !className || !subject || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const fileUrl = `${process.env.BASE_URL || 'http://localhost:8800'}/uploads/${file.filename}`;
    const newFile = new File({
      fileName: file.originalname,
      fileUrl,
      className,
      subject,
      category,
    });
    await newFile.save();

    let classDoc = await Class.findOne({ className });
    if (!classDoc) {
      classDoc = new Class({ className, subjects: [] });
    }

    let subjectDoc = classDoc.subjects.find(s => s.name === subject);
    if (!subjectDoc) {
      subjectDoc = { name: subject, categories: [] };
      classDoc.subjects.push(subjectDoc);
    }

    let categoryDoc = subjectDoc.categories.find(c => c.type === category);
    if (!categoryDoc) {
      categoryDoc = { type: category, files: [] };
      subjectDoc.categories.push(categoryDoc);
    }

    categoryDoc.files.push({
      fileName: file.originalname,
      fileUrl,
      uploadedAt: new Date(),
    });

    await classDoc.save();
    res.json({ message: 'File uploaded successfully', fileUrl, file: newFile });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});


// Update file details
app.put('/api/admin/files/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { className, subject, category } = req.body;

    const updatedFile = await File.findByIdAndUpdate(
      id,
      { className, subject, category },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(updatedFile);
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ message: 'Error updating file', error: error.message });
  }
});

// Delete file
app.delete('/api/admin/files/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file from storage
    const filePath = path.join(__dirname, 'uploads', path.basename(file.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete file document
    await File.findByIdAndDelete(id);

    // Remove file from class structure
    const classes = await Class.find({});
    for (let classDoc of classes) {
      let modified = false;
      classDoc.subjects.forEach(subject => {
        subject.categories.forEach(category => {
          const fileIndex = category.files.findIndex(f => f.fileUrl === file.fileUrl);
          if (fileIndex !== -1) {
            category.files.splice(fileIndex, 1);
            modified = true;
          }
        });
      });
      if (modified) {
        await classDoc.save();
      }
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});
// Get all files
app.get('/api/admin/files', authenticateAdmin, async (req, res) => {
  try {
    const classes = await Class.find();
    const files = [];

    classes.forEach(classDoc => {
      classDoc.subjects.forEach(subject => {
        subject.categories.forEach(category => {
          category.files.forEach(file => {
            files.push({
              id: file._id,
              fileName: file.fileName,
              fileUrl: file.fileUrl,
              className: classDoc.className,
              subject: subject.name,
              category: category.type,
              uploadedAt: file.uploadedAt
            });
          });
        });
      });
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files', error: error.message });
  }
});

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling for missing static files
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Handle errors globally
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));