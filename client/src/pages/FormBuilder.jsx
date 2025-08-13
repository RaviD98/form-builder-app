import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const QuestionEditor = ({ question, onUpdate, onDelete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const updateField = (field, value) => {
    const updatedQuestion = {
      ...question,
      content: { ...question.content, [field]: value },
    };
    onUpdate(updatedQuestion);
  };

  // Handle image upload to backend
  const handleFileChange = async (e) => {
    setUploadError("");
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post(
        "http://localhost:8080/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      updateField("image", res.data.url); // Assuming backend returns { url: "..." }
    } catch (err) {
      setUploadError("Image upload failed. Try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {question.type} Question
        </h3>
        <button
          onClick={onDelete}
          className="p-2 bg-red-100 rounded-full text-red-500 hover:bg-red-200"
        >
          ✕
        </button>
      </div>

      {/* ===== CATEGORIZE ===== */}
      {question.type === "Categorize" && (
        <>
          <input
            type="text"
            placeholder="Question Text"
            value={question.content.questionText}
            onChange={(e) => updateField("questionText", e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-500 p-2 mb-4"
          />
          <div className="mb-4">
            <label className="font-semibold">Categories:</label>
            {question.content.categories.map((c, idx) => (
              <input
                key={idx}
                type="text"
                value={c}
                onChange={(e) => {
                  const cats = [...question.content.categories];
                  cats[idx] = e.target.value;
                  updateField("categories", cats);
                }}
                className="w-full border p-2 mt-2"
              />
            ))}
            <button
              onClick={() =>
                updateField("categories", [
                  ...question.content.categories,
                  "New Category",
                ])
              }
              className="text-blue-500 mt-2"
            >
              + Add Category
            </button>
          </div>
        </>
      )}

      {/* ===== CLOZE ===== */}
      {question.type === "Cloze" && (
        <>
          <textarea
            placeholder="Enter text with [blank_x]"
            value={question.content.textWithBlanks}
            onChange={(e) => updateField("textWithBlanks", e.target.value)}
            className="w-full border p-2 mb-4"
          />
          <label className="font-semibold">Correct Answers JSON</label>
          <textarea
            value={JSON.stringify(question.content.correctAnswers, null, 2)}
            onChange={(e) => {
              try {
                updateField("correctAnswers", JSON.parse(e.target.value));
              } catch {}
            }}
            className="w-full border p-2 mt-2"
          />
        </>
      )}

      {/* ===== COMPREHENSION ===== */}
      {question.type === "Comprehension" && (
        <>
          <textarea
            placeholder="Enter passage..."
            value={question.content.passage}
            onChange={(e) => updateField("passage", e.target.value)}
            className="w-full border p-2 mb-4"
          />
          {question.content.subQuestions.map((sq, idx) => (
            <div key={idx} className="border-t pt-4 mt-4">
              <input
                type="text"
                placeholder="Sub-question"
                value={sq.questionText}
                onChange={(e) => {
                  const sqs = [...question.content.subQuestions];
                  sqs[idx].questionText = e.target.value;
                  updateField("subQuestions", sqs);
                }}
                className="w-full border p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Options (comma separated)"
                value={sq.options.join(",")}
                onChange={(e) => {
                  const sqs = [...question.content.subQuestions];
                  sqs[idx].options = e.target.value.split(",");
                  updateField("subQuestions", sqs);
                }}
                className="w-full border p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Correct Answer"
                value={sq.correctAnswer}
                onChange={(e) => {
                  const sqs = [...question.content.subQuestions];
                  sqs[idx].correctAnswer = e.target.value;
                  updateField("subQuestions", sqs);
                }}
                className="w-full border p-2"
              />
            </div>
          ))}
          <button
            onClick={() =>
              updateField("subQuestions", [
                ...question.content.subQuestions,
                { questionText: "", options: [], correctAnswer: "" },
              ])
            }
            className="text-blue-500 mt-2"
          >
            + Add Sub-Question
          </button>
        </>
      )}

      {/* ===== IMAGE UPLOAD ===== */}
      <div className="mt-4">
        <label className="font-semibold block mb-1">
          Upload Question Image
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && (
          <p className="text-blue-500 text-sm mt-2">Uploading...</p>
        )}
        {uploadError && (
          <p className="text-red-500 text-sm mt-2">{uploadError}</p>
        )}
        {question.content.image && (
          <div className="mt-3 relative">
            <img
              src={question.content.image}
              alt="Question"
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              onClick={() => updateField("image", "")}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function FormBuilder() {
  const [form, setForm] = useState({
    title: "",
    headerImage: "",
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const addQuestion = (type) => {
    let content = {};
    if (type === "Categorize") {
      content = {
        questionText: "",
        categories: ["Category 1"],
        items: [{ text: "Item 1", category: "" }],
      };
    } else if (type === "Cloze") {
      content = { textWithBlanks: "", correctAnswers: {} };
    } else {
      content = { passage: "", subQuestions: [] };
    }
    setForm((f) => ({
      ...f,
      questions: [...f.questions, { questionId: uuidv4(), type, content }],
    }));
  };

  const updateQuestion = (q, idx) => {
    const qs = [...form.questions];
    qs[idx] = q;
    setForm({ ...form, questions: qs });
  };

  const deleteQuestion = (idx) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((_, i) => i !== idx),
    }));
  };

  const saveForm = async () => {
    if (!form.title.trim()) return setMessage("Please enter a form title!");
    if (form.questions.length === 0)
      return setMessage("Add at least one question!");
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:8080/api/forms", form);
      setMessage(`✅ Form saved! ID: ${res.data.data._id}`);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex p-8 gap-6">
      <div className="flex-1 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            📝 Form Builder
          </h1>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder="Form Title"
            className="w-full border-b-2 text-xl p-2 mb-4"
          />

          <input
            type="text"
            name="headerImage"
            value={form.headerImage}
            onChange={handleFormChange}
            placeholder="Header Image URL"
            className="w-full border p-2 mb-4"
          />
          {form.headerImage && (
            <img
              src={form.headerImage}
              alt="Header"
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
          )}

          {form.questions.map((q, i) => (
            <QuestionEditor
              key={q.questionId}
              question={q}
              onUpdate={(updated) => updateQuestion(updated, i)}
              onDelete={() => deleteQuestion(i)}
            />
          ))}
        </div>
      </div>

      <div className="w-72 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-10">
        <h2 className="text-lg font-bold mb-4">➕ Add Question</h2>
        <button
          onClick={() => addQuestion("Categorize")}
          className="w-full p-2 mb-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Categorize
        </button>
        <button
          onClick={() => addQuestion("Cloze")}
          className="w-full p-2 mb-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Cloze
        </button>
        <button
          onClick={() => addQuestion("Comprehension")}
          className="w-full p-2 mb-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Comprehension
        </button>

        <hr className="my-4" />
        <button
          onClick={saveForm}
          disabled={loading}
          className="w-full p-3 bg-teal-500 text-white font-bold rounded-lg"
        >
          {loading ? "Saving..." : "Save Form"}
        </button>
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
