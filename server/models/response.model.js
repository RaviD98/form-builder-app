import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String, 
      required: [true, "Question ID is required"],
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Answer is required"],
    },
  },
  { _id: false }
);


const responseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: [true, "Form ID is required"],
      index: true, 
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

responseSchema.index({ formId: 1, createdAt: -1 });

export const Response = mongoose.model("Response", responseSchema);
