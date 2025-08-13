import express from "express";
import { Form } from "../models/form.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const router = express.Router();

/**
 * @route   POST /api/forms
 * @desc    Creates a new form in the database.
 * @access  Public (for now)
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    // 1. Extract and validate required fields from the request body.
    const { title, headerImage, questions, createdBy } = req.body;

    // A simple check to ensure essential data is present.
    // The Mongoose schema will handle more detailed validation.
    if (!title || !questions || questions.length === 0) {
      throw new ApiError(400, "Title and at least one question are required.");
    }

    // 2. Create and save the new form document to the database.
    const newForm = await Form.create({
      title,
      headerImage,
      questions,
      createdBy,
    });

    // 3. Check if the form was successfully created.
    if (!newForm) {
      throw new ApiError(500, "Failed to create the form. Please try again.");
    }

    // 4. Respond with a standardized success message and the created form document.
    return res
      .status(201)
      .json(new ApiResponse(201, newForm, "Form created successfully."));
  })
);

/**
 * @route   GET /api/forms/:id
 * @desc    Retrieves a single form by its unique ID.
 * @access  Public
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // 1. Extract the form ID from the URL parameters.
    const { id } = req.params;

    // 2. Find the form in the database by its ID.
    const form = await Form.findById(id);

    // 3. If no form is found, throw an ApiError.
    if (!form) {
      throw new ApiError(404, "Form not found.");
    }

    // 4. If the form is found, respond with a success message and the form data.
    return res
      .status(200)
      .json(new ApiResponse(200, form, "Form retrieved successfully."));
  })
);

export default router;
