import mongoose from "mongoose";

// A sub-schema for the content of a question.
// 'strict: false' allows us to store different key-value pairs
// for each question type (e.g., 'categories' for Categorize,
// 'textWithBlanks' for Cloze). This is a flexible and scalable solution.
const questionContentSchema = new mongoose.Schema(
  {},
  { _id: false, strict: false }
);

// The main schema for a question within the form.
const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: [true, "Question ID is required"],
    },
    type: {
      type: String,
      enum: ["Categorize", "Cloze", "Comprehension"],
      required: [true, "Question type is required"],
    },
    content: {
      type: questionContentSchema,
      required: [true, "Question content is required"],
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
