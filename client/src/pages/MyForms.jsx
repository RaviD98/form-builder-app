import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const MyForms = () => {
  const navigate = useNavigate();
  const [myForms, setMyForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const savedForms = JSON.parse(
      localStorage.getItem("myCreatedForms") || "[]"
    );
    setMyForms(savedForms);
    setLoading(false);
  }, []);

  const handleViewForm = (formId) => {
    navigate(`/form-fill/${formId}`);
  };

  const handlePreviewForm = (formId) => {
    navigate(`/form-preview/${formId}`);
  };

  const handleViewResponses = (formId) => {
    navigate(`/form-responses/${formId}`);
  };

  const handleDeleteForm = (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      const updatedForms = myForms.filter((form) => form.id !== formId);
      setMyForms(updatedForms);
      localStorage.setItem("myCreatedForms", JSON.stringify(updatedForms));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-12 w-12 text-blue-500">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar showMyForms={true} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Forms</h1>
          <p className="text-gray-600">
            Manage your created forms and view responses
          </p>
        </div>

        {myForms.length === 0 ? (
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
              No forms yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first form to get started
            </p>
            <button
              onClick={() => navigate("/builder")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg font-medium"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                    {form.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Created on {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    {form.questionCount} question
                    {form.questionCount !== 1 ? "s" : ""}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => handleViewForm(form.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                    >
                      View Form
                    </button>
                    <button
                      onClick={() => handlePreviewForm(form.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleViewResponses(form.id)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                    >
                      Responses
                    </button>
                    <button
                      onClick={() => handleDeleteForm(form.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="text-xs text-gray-400 border-t pt-2">
                    Form ID: {form.id.substring(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyForms;
