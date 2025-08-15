import express from "express";
import { Response } from "../models/response.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    // 1. Extract data from the request body.
    const { formId, answers, submittedBy } = req.body;

    // 2. Perform validation to ensure essential data is present.
    if (!formId) {
      throw new ApiError(400, "Form ID is required for the response.");
    }

    if (!answers || answers.length === 0) {
      throw new ApiError(400, "Response must contain at least one answer.");
    }

    // 3. Create a new response document.
    const newResponse = await Response.create({
      formId,
      answers,
      submittedBy,
    });

    // 4. Check if the document was created successfully.
    if (!newResponse) {
      throw new ApiError(500, "Failed to save the response. Please try again.");
    }

    // 5. Respond with a success message and the saved response document.
    return res
      .status(201)
      .json(new ApiResponse(201, newResponse, "Response saved successfully."));
  })
);

router.get(
  "/:formId",
  asyncHandler(async (req, res) => {
    // 1. Extract the form ID 
    const { formId } = req.params;

    // 2. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      throw new ApiError(400, "Invalid form ID format.");
    }

    // 3. Find all responses in the database that match the formId.
    const responses = await Response.find({ formId }).sort({ createdAt: -1 });

    // 4. If no responses are found, return an empty array, which is a success case.
    if (!responses) {
      throw new ApiError(500, "Failed to retrieve responses.");
    }

    // 5. Respond with a success message and the array of responses.
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responses,
          responses.length > 0
            ? `Found ${responses.length} responses.`
            : "No responses found for this form."
        )
      );
  })
);

export default router;
