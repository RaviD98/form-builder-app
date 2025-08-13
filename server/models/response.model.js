import mongoose from "mongoose";

// Sub-schema for a single answer.
const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String, // Matches the questionId from the Form model
      required: [true, "Question ID is required"],
    },
    answer: {
      type: mongoose.Schema.Types.Mixed, // Allows for different answer types (string, array, object)
      required: [true, "Answer is required"],
    },
  },
  { _id: false }
);

// The main Response schema
const responseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form", // Establishes the relationship to the Form model
      required: [true, "Form ID is required"],
      index: true, // Optimizes queries for responses of a specific form
    },
    answers: {
      type: [answerSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Response must contain at least one answer",
      },
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index for fast lookups by the form ID.
responseSchema.index({ formId: 1, createdAt: -1 });

export const Response = mongoose.model("Response", responseSchema);
