import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { formAPI } from "../../services/api";
import CategorizeRenderer from "./QuestionRenderers/CategorizeRenderer";
import ClozeRenderer from "./QuestionRenderers/ClozeRenderer";
import ComprehensionRenderer from "./QuestionRenderers/ComprehensionRenderer";

const FormFill = () => {
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchFormData();
  }, [id]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await formAPI.getForm(id);

      if (response.data.success) {
        setFormData(response.data.data);
        // Initialize answers object
        const initialAnswers = {};
        response.data.data.questions.forEach((question) => {
          initialAnswers[question.id] = getDefaultAnswer(question.type);
        });
        setAnswers(initialAnswers);
      }
    } catch (err) {
      setError("Failed to load form. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDefaultAnswer = (questionType) => {
    switch (questionType) {
      case "categorize":
        return {}; // Will store item-category mappings
      case "cloze":
        return []; // Will store selected options for blanks
      case "comprehension":
        return []; // Will store selected answers for MCQs
      default:
        return null;
    }
  };

  // Update answer for a specific question
  const updateAnswer = (questionId, answerData) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerData,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Validate that all questions are answered
      const unansweredQuestions = formData.questions.filter((question) => {
        const answer = answers[question.id];
        return !isAnswerComplete(question.type, answer);
      });

      if (unansweredQuestions.length > 0) {
        throw new Error(
          `Please answer all questions. ${unansweredQuestions.length} questions remaining.`
        );
      }

      // Prepare response data - FIXED: Map question.id to questionId
      const responseData = {
        formId: id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId, // This should match the question.id from the form
          answer,
        })),
        // submittedBy after user authentication
      };

      console.log("Submitting response:", responseData); // Debug log

      const response = await formAPI.submitResponse(responseData);

      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isAnswerComplete = (questionType, answer) => {
    switch (questionType) {
      case "categorize":
        return answer && Object.keys(answer).length > 0;
      case "cloze":
        return (
          answer &&
          answer.length > 0 &&
          answer.every((a) => a !== null && a !== "")
        );
      case "comprehension":
        return (
          answer &&
          answer.length > 0 &&
          answer.every((a) => a !== null && a !== undefined)
        );
      default:
        return false;
    }
  };

  const renderQuestion = (question, index) => {
    const commonProps = {
      question,
      answer: answers[question.id],
      onAnswerChange: (answerData) => updateAnswer(question.id, answerData),
      questionNumber: index + 1,
    };

    switch (question.type) {
      case "categorize":
        return <CategorizeRenderer key={question.id} {...commonProps} />;
      case "cloze":
        return <ClozeRenderer key={question.id} {...commonProps} />;
      case "comprehension":
        return <ComprehensionRenderer key={question.id} {...commonProps} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin mx-auto h-12 w-12 text-blue-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Form
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your form...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mx-auto h-12 w-12 text-red-500 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Form
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="mx-auto h-16 w-16 text-green-500 mb-6">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Form Submitted Successfully!
          </h2>
          <p className="text-gray-600">Thank you for your responses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {location.state?.message && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-800 font-medium">
                  {location.state.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* 1. Banner image (optional) */}
          {formData.headerImage && (
            <div className="w-full overflow-hidden">
              {/* 3 : 1 aspect ratio → change pt-[33%] for 2 : 1 (pt-[50%]) */}
              <div className="relative pt-[33%]">
                <img
                  src={formData.headerImage}
                  alt="Form banner"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* 2. Title */}
          <div className="px-8 py-12 text-center bg-gradient-to-r from-blue-400 to-indigo-500">
            <h1 className="text-4xl font-bold text-white">{formData.title}</h1>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8 mb-8">
          {formData.questions.map(renderQuestion)}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`
                relative px-8 py-4 text-lg font-semibold rounded-lg transition duration-200 transform
                ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                }
                focus:outline-none focus:ring-4 focus:ring-blue-300
              `}
            >
              {submitting && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {submitting ? "Submitting Form..." : "Submit Form"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormFill;
