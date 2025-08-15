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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedFormId, setSavedFormId] = useState(null);
  const [isFormSaved, setIsFormSaved] = useState(false);
  const navigate = useNavigate();

  const getDefaultQuestionData = (type) => {
    switch (type) {
      case "categorize":
        return { question: "", categories: [""], items: [""], image: "" };
      case "cloze":
        return { question: "", sentence: "", options: [""], image: "" };
      case "comprehension":
        return {
          question: "",
          passage: "",
          mcqs: [{ question: "", options: ["", "", "", ""], correct: 0 }],
          image: "",
        };
      default:
        return { question: "", image: "" };
    }
  };

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
    setIsFormSaved(false);
    setSavedFormId(null);
  };

  const updateQuestion = (questionId, updatedData) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updatedData } : q
      ),
    }));
    setIsFormSaved(false);
    setSavedFormId(null);
  };

  const removeQuestion = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
    setIsFormSaved(false);
    setSavedFormId(null);
  };

  const handleHeaderImageUpload = async (file) => {
    try {
      const res = await formAPI.uploadImage(file);
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, headerImage: res.data.data.url }));
        setIsFormSaved(false);
        setSavedFormId(null);
      }
    } catch {
      setError("Failed to upload header image");
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!formData.title.trim()) throw new Error("Form title is required");
      if (formData.questions.length === 0)
        throw new Error("At least one question is required");

      const res = await formAPI.createForm(formData);
      if (res.data.success) {
        const id = res.data.data._id;
        setSavedFormId(id);
        setIsFormSaved(true);

        const cache = JSON.parse(
          localStorage.getItem("myCreatedForms") || "[]"
        );
        cache.push({
          id,
          title: formData.title,
          questionCount: formData.questions.length,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("myCreatedForms", JSON.stringify(cache));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () =>
    savedFormId && navigate(`/form-preview/${savedFormId}`);

  const renderQuestionComponent = (q) => {
    const props = {
      question: q,
      onUpdate: (d) => updateQuestion(q.id, d),
      onRemove: () => removeQuestion(q.id),
    };
    switch (q.type) {
      case "categorize":
        return <CategorizeQuestion key={q.id} {...props} />;
      case "cloze":
        return <ClozeQuestion key={q.id} {...props} />;
      case "comprehension":
        return <ComprehensionQuestion key={q.id} {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Form Builder
          </h1>
          <p className="text-lg text-gray-600">
            Create beautiful and interactive forms with ease
          </p>
        </header>

        <section className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8">
            {/* Success message */}
            {isFormSaved && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <svg
                  className="h-5 w-5 text-green-400 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-800 font-medium">
                  Form saved! Share link&nbsp;
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded">
                    {`${window.location.origin}/form-fill/${savedFormId}`}
                  </span>
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <svg
                  className="h-5 w-5 text-red-400 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Form title */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Form Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Enter a compelling form title…"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg placeholder-gray-400"
              />
            </div>

            {/* Header image*/}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Header Image (Optional)
              </label>

              <div
                onClick={() => {
                  const input = document.getElementById("header-image-input");
                  if (input) input.click();
                }}
                className="w-full overflow-hidden rounded-xl cursor-pointer"
              >
                <div className="relative pt-[5%] bg-gray-50 border-2 border-dashed border-gray-300 hover:border-gray-400 transition">
                  {formData.headerImage && (
                    <img
                      src={formData.headerImage}
                      alt="Header banner"
                      className="absolute inset-0 h-full w-full object-cover rounded-xl"
                    />
                  )}

                  <ImageUpload
                    inputId="header-image-input"
                    onUpload={handleHeaderImageUpload}
                    currentImage={formData.headerImage}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm">
                  {formData.questions.length} question
                  {formData.questions.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-6 mb-8">
                {formData.questions.map(renderQuestionComponent)}
              </div>

              {formData.questions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No questions yet
                  </h3>
                  <p className="text-gray-500">
                    Get started by adding your first question below
                  </p>
                </div>
              )}

              {/* Add-question buttons */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Add New Question
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <AddBtn
                    color="blue"
                    label="Categorize"
                    sub="Drag & drop items"
                    onClick={() => addQuestion("categorize")}
                  />
                  <AddBtn
                    color="green"
                    label="Cloze"
                    sub="Fill in the blanks"
                    onClick={() => addQuestion("cloze")}
                  />
                  <AddBtn
                    color="purple"
                    label="Comprehension"
                    sub="Reading & MCQs"
                    onClick={() => addQuestion("comprehension")}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center pt-6 border-t border-gray-200 space-x-4">
              <MainButton
                busy={saving}
                done={isFormSaved}
                onClick={handleSubmit}
              >
                {saving
                  ? "Saving Form…"
                  : isFormSaved
                  ? "✓ Form Saved"
                  : "Create Form"}
              </MainButton>

              <PreviewButton disabled={!isFormSaved} onClick={handlePreview} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            {isFormSaved
              ? "Your form is saved and ready to share with respondents"
              : "Save your form to generate a shareable link"}
          </p>
        </footer>
      </div>
    </div>
  );
};


const AddBtn = ({ color, label, sub, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative bg-white hover:bg-${color}-50 border-2 border-${color}-200 hover:border-${color}-300 rounded-lg p-4 text-center transition duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer`}
  >
    <div className={`mx-auto h-8 w-8 text-${color}-600 mb-2`}>
      {/* simple plus icon */}
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </div>
    <span className="font-semibold text-gray-900">{label}</span>
    <p className="text-xs text-gray-600 mt-1">{sub}</p>
  </button>
);

const MainButton = ({ busy, done, children, ...rest }) => (
  <button
    {...rest}
    disabled={busy || done}
    className={`relative px-8 py-4 text-lg font-semibold rounded-lg transition duration-200 transform focus:outline-none focus:ring-4 focus:ring-blue-300 ${
      busy
        ? "bg-gray-400 text-white cursor-not-allowed"
        : done
        ? "bg-green-600 text-white cursor-default"
        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
    }`}
  >
    {busy && (
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
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    )}
    {children}
  </button>
);

const PreviewButton = ({ disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative px-8 py-4 text-lg font-semibold rounded-lg transition duration-200 transform focus:outline-none focus:ring-4 focus:ring-green-300 ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
    }`}
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
);

export default FormBuilder;
