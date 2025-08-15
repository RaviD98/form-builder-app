import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formAPI } from "../../services/api";
import ResponseTable from "./ResponseTable";

const FormResponses = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      console.log("Fetching data for formId:", formId); // Debug log

      // Fetch form data and responses in parallel
      const [formResponse, responsesResponse] = await Promise.all([
        formAPI.getForm(formId),
        formAPI.getResponses(formId),
      ]);

      console.log("Form response:", formResponse.data); // Debug log
      console.log("Responses response:", responsesResponse.data); // Debug log

      if (formResponse.data.success) {
        setFormData(formResponse.data.data);
      } else {
        throw new Error("Failed to fetch form data");
      }

      if (responsesResponse.data.success) {
        setResponses(responsesResponse.data.data);
      } else {
        throw new Error("Failed to fetch responses");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load form responses."
      );
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!responses.length || !formData) return;

    // Create CSV headers
    const headers = ["Response ID", "Submitted At"];
    formData.questions.forEach((question, index) => {
      headers.push(`Q${index + 1}: ${question.question.substring(0, 50)}...`);
    });

    // Create CSV rows
    const rows = responses.map((response) => {
      const row = [response._id, new Date(response.createdAt).toLocaleString()];

      formData.questions.forEach((question) => {
        // FIXED: Match question.id with answer.questionId
        const answer = response.answers.find(
          (a) => a.questionId === question.id
        );
        if (answer) {
          row.push(formatAnswerForCSV(question.type, answer.answer));
        } else {
          row.push("No answer");
        }
      });

      return row;
    });

    // Generate CSV content
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.title}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatAnswerForCSV = (questionType, answer) => {
    switch (questionType) {
      case "categorize":
        return Object.entries(answer || {})
          .map(([item, category]) => `${item}: ${category}`)
          .join("; ");
      case "cloze":
        return Array.isArray(answer) ? answer.join(", ") : "No answer";
      case "comprehension":
        return Array.isArray(answer)
          ? answer
              .map((ans, idx) => `MCQ${idx + 1}: Option ${ans + 1}`)
              .join("; ")
          : "No answer";
      default:
        return JSON.stringify(answer);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin mx-auto h-12 w-12 text-indigo-500 mb-4">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Responses
            </h2>
            <p className="text-gray-600">Fetching form responses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Responses
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Form Responses
                </h1>
                <p className="text-indigo-100 text-lg">{formData?.title}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 text-center">
                  <div className="text-3xl font-bold text-white">
                    {responses.length}
                  </div>
                  <div className="text-indigo-100 text-sm">Total Responses</div>
                </div>
                <button
                  onClick={exportToCSV}
                  disabled={!responses.length}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    responses.length
                      ? "bg-white text-indigo-600 hover:bg-indigo-50 hover:scale-105 shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Responses Content */}
        {responses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Responses Yet
            </h3>
            <p className="text-gray-600 mb-6">
              This form hasn't received any responses yet.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 inline-block">
              <p className="text-indigo-800 text-sm">
                Share your form link to start collecting responses!
              </p>
            </div>
          </div>
        ) : (
          <ResponseTable formData={formData} responses={responses} />
        )}
      </div>
    </div>
  );
};

export default FormResponses;
