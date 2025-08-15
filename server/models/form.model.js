import mongoose from "mongoose";

// A sub-schema for the content of a question.
// 'strict: false' allows us to store different key-value pairs
// for each question type (e.g., 'categories' for Categorize,
// 'sentence' and 'options' for Cloze, 'passage' and 'mcqs' for Comprehension).
const questionContentSchema = new mongoose.Schema(
  {},
  { _id: false, strict: false }
);

// The main schema for a question within the form.
const questionSchema = new mongoose.Schema(
  {
    id: {
      // Changed from 'questionId' to 'id' to match frontend
      type: String,
      required: [true, "Question ID is required"],
    },
    type: {
      type: String,
      enum: ["categorize", "cloze", "comprehension"], // Changed to lowercase to match frontend
      required: [true, "Question type is required"],
    },
    question: {
      // Changed from 'content' to 'question' to match frontend
      type: String,
      required: [true, "Question text is required"],
    },
    // Optional fields that can be present for different question types
    categories: {
      type: [String],
      default: undefined, // Will only be saved if provided
    },
    items: {
      type: [String],
      default: undefined,
    },
    sentence: {
      type: String,
      default: undefined,
    },
    options: {
      type: [String],
      default: undefined,
    },
    passage: {
      type: String,
      default: undefined,
    },
    mcqs: {
      type: [
        {
          question: String,
          options: [String],
          correct: Number,
        },
      ],
      default: undefined,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false } // We don't need a separate _id for each question
);

// The main Form schema
const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Form title is required"],
      trim: true,
      maxlength: 200,
    },
    headerImage: {
      type: String,
      trim: true,
      default: "",
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Form must have at least one question",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// The unique index is on createdBy, not formId
formSchema.index({ createdBy: 1, createdAt: -1 });

export const Form = mongoose.model("Form", formSchema);
