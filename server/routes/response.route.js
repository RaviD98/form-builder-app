import express from "express";
import { Response } from "../models/response.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const router = express.Router();

/**
 * @route   POST /api/responses
 * @desc    Saves a new user response to a form.
 * @access  Public
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    // 1. Extract data from the request body.
    const { formId, answers, submittedBy } = req.body;

    // 2. Perform validation to ensure essential data is present.
    // The Mongoose schema will handle more detailed validation on the data types.
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

    // 5. Respond with a standardized success message and the saved response document.
    return res
      .status(201)
      .json(new ApiResponse(201, newResponse, "Response saved successfully."));
  })
);

/**
 * @route   GET /api/responses/:formId
 * @desc    Retrieves all responses for a specific form.
 * @access  Public (Can be restricted to authenticated users later)
 */
router.get(
  "/:formId",
  asyncHandler(async (req, res) => {
    // 1. Extract the form ID from the URL parameters.
    const { formId } = req.params;

    // 2. Find all responses in the database that match the formId.
    // We use .find() to get all matching documents, not just one.
    const responses = await Response.find({ formId });

    // 3. If no responses are found, we return an empty array, which is a success case.
    // We don't throw an error because it's valid for a form to have no responses yet.
    if (!responses) {
      throw new ApiError(500, "Failed to retrieve responses.");
    }

    // 4. Respond with a success message and the array of responses.
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responses,
          "Responses retrieved successfully."
        )
      );
  })
);

export default router;
