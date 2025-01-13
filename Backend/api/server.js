import express, { json } from "express";
import { connect, Schema, model } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
