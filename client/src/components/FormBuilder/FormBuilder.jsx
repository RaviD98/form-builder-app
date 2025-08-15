import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formAPI } from "../../services/api";
import ImageUpload from "../common/ImageUpload";
import CategorizeQuestion from "./QuestionComponents/CategorizeQuestion";
import ClozeQuestion from "./QuestionComponents/ClozeQuestion";
import ComprehensionQuestion from "./QuestionComponents/ComprehensionQuestion";

const FormBuilder = () => {
  const [formData, setFormData] = useState({
    title: "",
    headerImage: "",
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // New state for saving
  const [error, setError] = useState(null);
  const [savedFormId, setSavedFormId] = useState(null); // Track saved form ID
  const [isFormSaved, setIsFormSaved] = useState(false); // Track if form is saved
  const navigate = useNavigate();

  // Add new question
  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      ...getDefaultQuestionData(type),
    };

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    // Reset saved state when form is modified
    setIsFormSaved(false);
    setSavedFormId(null);
  };

  // Get default data structure for each question type
  const getDefaultQuestionData = (type) => {
    switch (type) {
      case "categorize":
        return {
          question: "",
          categories: [""],
          items: [""],
          image: "",
        };
      case "cloze":
        return {
          question: "",
          sentence: "",
          options: [""],
          image: "",
        };
      case "comprehension":
        return {
          question: "",
          passage: "",
          mcqs: [{ question: "", options: ["", "", "", ""], correct: 0 }],
          image: "",
        };
      default:
        return {
          question: "",
          image: "",
        };
    }
  };

  // Update question data
  const updateQuestion = (questionId, updatedData) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updatedData } : q
      ),
    }));

    // Reset saved state when form is modified
    setIsFormSaved(false);
    setSavedFormId(null);
  };

  // Remove question
  const removeQuestion = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));

    // Reset saved state when form is modified
    setIsFormSaved(false);
    setSavedFormId(null);
  };

  // Handle form submission - UPDATED VERSION
  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Form title is required");
      }

      if (formData.questions.length === 0) {
        throw new Error("At least one question is required");
      }

      // Submit form to backend
      const response = await formAPI.createForm(formData);

      if (response.data.success) {
        const formId = response.data.data._id;
        setSavedFormId(formId);
        setIsFormSaved(true);

        // Save form info to localStorage for "My Forms" feature
        const myForms = JSON.parse(
          localStorage.getItem("myCreatedForms") || "[]"
        );
        const formInfo = {
          id: formId,
          title: formData.title,
          questionCount: formData.questions.length,
          createdAt: new Date().toISOString(),
        };
        myForms.push(formInfo);
        localStorage.setItem("myCreatedForms", JSON.stringify(myForms));

        setError(null);
        console.log("Form saved successfully with ID:", formId);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // NEW: Handle preview
  const handlePreview = () => {
    if (savedFormId) {
      navigate(`/form-preview/${savedFormId}`);
    }
  };

  // Handle header image upload
  const handleHeaderImageUpload = async (file) => {
    try {
      const response = await formAPI.uploadImage(file);
      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          headerImage: response.data.data.url,
        }));

        // Reset saved state when form is modified
        setIsFormSaved(false);
        setSavedFormId(null);
      }
    } catch (err) {
      setError("Failed to upload header image");
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setFormData((prev) => ({ ...prev, title: e.target.value }));
    // Reset saved state when form is modified
    setIsFormSaved(false);
    setSavedFormId(null);
  };

  // Render question component based on type
  const renderQuestionComponent = (question) => {
    const commonProps = {
      question,
      onUpdate: (data) => updateQuestion(question.id, data),
      onRemove: () => removeQuestion(question.id),
    };

    switch (question.type) {
      case "categorize":
        return <CategorizeQuestion key={question.id} {...commonProps} />;
      case "cloze":
        return <ClozeQuestion key={question.id} {...commonProps} />;
      case "comprehension":
        return <ComprehensionQuestion key={question.id} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Form Builder
          </h1>
          <p className="text-lg text-gray-600">
            Create beautiful and interactive forms with ease
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8">
            {/* Success Message */}
            {isFormSaved && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
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
                <div>
                  <p className="text-green-800 font-medium">
                    Form saved successfully! You can now preview it or share the
                    link:
                    <span className="font-mono text-sm ml-2 bg-green-100 px-2 py-1 rounded">
                      {`${window.location.origin}/form-fill/${savedFormId}`}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
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
                <div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Form Title Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Form Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter a compelling form title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg placeholder-gray-400"
              />
            </div>

            {/* Header Image Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Header Image (Optional)
              </label>
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition duration-200">
                <ImageUpload
                  onUpload={handleHeaderImageUpload}
                  currentImage={formData.headerImage}
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {formData.questions.length} question
                    {formData.questions.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Render Questions */}
              <div className="space-y-6 mb-8">
                {formData.questions.map(renderQuestionComponent)}
              </div>

              {/* No Questions Message */}
              {formData.questions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No questions yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Get started by adding your first question below
                  </p>
                </div>
              )}

              {/* Add Question Buttons */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Add New Question
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => addQuestion("categorize")}
                    className="group relative bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 rounded-lg p-4 text-center transition duration-200 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="mx-auto h-8 w-8 text-blue-600 mb-2">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900">
                      Categorize
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      Drag & drop items
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => addQuestion("cloze")}
                    className="group relative bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-300 rounded-lg p-4 text-center transition duration-200 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="mx-auto h-8 w-8 text-green-600 mb-2">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900">Cloze</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Fill in the blanks
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => addQuestion("comprehension")}
                    className="group relative bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-300 rounded-lg p-4 text-center transition duration-200 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="mx-auto h-8 w-8 text-purple-600 mb-2">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900">
                      Comprehension
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Reading & MCQs</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons - UPDATED */}
            <div className="flex justify-center pt-6 border-t border-gray-200 space-x-4">
              {/* Create Form Button */}
              <button
                onClick={handleSubmit}
                disabled={saving || isFormSaved}
                className={`
                  relative px-8 py-4 text-lg font-semibold rounded-lg transition duration-200 transform
                  ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : isFormSaved
                      ? "bg-green-600 text-white cursor-default"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  }
                  focus:outline-none focus:ring-4 focus:ring-blue-300
                `}
              >
                {saving && (
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
                {saving
                  ? "Saving Form..."
                  : isFormSaved
                  ? "✓ Form Saved"
                  : "Create Form"}
              </button>

              {/* Preview Button - NEW */}
              <button
                onClick={handlePreview}
                disabled={!isFormSaved}
                className={`
                  relative px-8 py-4 text-lg font-semibold rounded-lg transition duration-200 transform
                  ${
                    !isFormSaved
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  }
                  focus:outline-none focus:ring-4 focus:ring-green-300
                `}
              >
                <svg
                  className="h-5 w-5 mr-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview Form
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            {isFormSaved
              ? "Your form is saved and ready to share with respondents"
              : "Save your form to generate a shareable link"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
