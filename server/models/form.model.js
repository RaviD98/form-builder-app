import mongoose from "mongoose";

const questionContentSchema = new mongoose.Schema(
  {},
  { _id: false, strict: false }
);

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Question ID is required"],
    },
    type: {
      type: String,
      enum: ["categorize", "cloze", "comprehension"], 
      required: [true, "Question type is required"],
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
    },
    categories: {
      type: [String],
      default: undefined, 
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
  { _id: false } 
);

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

formSchema.index({ createdBy: 1, createdAt: -1 });

export const Form = mongoose.model("Form", formSchema);
