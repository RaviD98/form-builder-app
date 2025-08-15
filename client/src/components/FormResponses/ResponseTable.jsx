import React, { useState } from "react";

const ResponseTable = ({ formData, responses }) => {
  const [selectedResponse, setSelectedResponse] = useState(null);

  const formatAnswer = (questionType, answer) => {
    if (!answer) return "No answer";

    try {
      switch (questionType) {
        case "categorize":
          if (typeof answer === "object" && !Array.isArray(answer)) {
            return Object.entries(answer)
              .map(([item, category]) => `${item} → ${category}`)
              .join(", ");
          }
          return "Invalid categorize answer";

        case "cloze":
          if (Array.isArray(answer)) {
            return answer.join(", ");
          }
          return "Invalid cloze answer";

        case "comprehension":
          if (Array.isArray(answer)) {
            return answer
              .map((ans, idx) => `Q${idx + 1}: Option ${ans + 1}`)
              .join(", ");
          }
          return "Invalid comprehension answer";

        default:
          return JSON.stringify(answer);
      }
    } catch (error) {
      console.error("Error formatting answer:", error);
      return "Error formatting answer";
    }
  };

  const getAnswerForQuestion = (response, questionId) => {
    // FIXED: Match questionId correctly
    const answerObj = response.answers.find((a) => a.questionId === questionId);
    return answerObj ? answerObj.answer : null;
  };

  // Handle row click to show detailed view
  const handleRowClick = (response) => {
    setSelectedResponse(
      selectedResponse?._id === response._id ? null : response
    );
  };

  if (!responses.length) {
    return (
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
          No Responses Available
        </h3>
        <p className="text-gray-600">
          This form hasn't received any responses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4"
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
                  <span>Response ID</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Submitted At</span>
                </div>
              </th>
              {formData.questions.map((question, index) => (
                <th
                  key={question.id}
                  className="px-6 py-4 text-left text-sm font-semibold min-w-48 max-w-64"
                >
                  <div className="flex items-center space-x-2">
                    <span className="bg-white/20 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="truncate">
                      {question.question.length > 30
                        ? `${question.question.substring(0, 30)}...`
                        : question.question}
                    </span>
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-center text-sm font-semibold">
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="h-4 w-4"
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
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {responses.map((response, responseIndex) => (
              <React.Fragment key={response._id}>
                <tr
                  className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    selectedResponse?._id === response._id
                      ? "bg-indigo-50 border-l-4 border-indigo-500"
                      : ""
                  }`}
                  onClick={() => handleRowClick(response)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 text-indigo-800 rounded-lg px-3 py-1 text-sm font-mono">
                        #{responseIndex + 1}
                      </div>
                      <span className="text-gray-500 text-sm font-mono">
                        {response._id.substring(0, 8)}...
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(response.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(response.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  {formData.questions.map((question) => {
                    const answer = getAnswerForQuestion(response, question.id);
                    const hasAnswer = answer !== null && answer !== undefined;

                    return (
                      <td key={question.id} className="px-6 py-4">
                        <div
                          className={`text-sm rounded-lg px-3 py-2 max-w-xs truncate ${
                            hasAnswer
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-gray-50 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {formatAnswer(question.type, answer)}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(response);
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedResponse?._id === response._id
                          ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {selectedResponse?._id === response._id ? (
                        <>
                          <svg
                            className="h-3 w-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          Hide
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-3 w-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          View
                        </>
                      )}
                    </button>
                  </td>
                </tr>

                {/* Detailed view row */}
                {selectedResponse?._id === response._id && (
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <td
                      colSpan={formData.questions.length + 3}
                      className="px-6 py-8"
                    >
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-200">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xl font-bold text-gray-900 flex items-center">
                            <svg
                              className="h-6 w-6 mr-2 text-indigo-600"
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
                            Detailed Response
                          </h4>
                          <button
                            onClick={() => setSelectedResponse(null)}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          >
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <p className="text-sm text-indigo-600 font-medium mb-1">
                              Response ID
                            </p>
                            <p className="font-mono text-indigo-900 text-sm">
                              {response._id}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <p className="text-sm text-purple-600 font-medium mb-1">
                              Submitted
                            </p>
                            <p className="text-purple-900 text-sm">
                              {new Date(response.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h5 className="text-lg font-semibold text-gray-900 flex items-center">
                            <svg
                              className="h-5 w-5 mr-2 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Questions & Answers
                          </h5>

                          <div className="space-y-6">
                            {formData.questions.map((question, index) => {
                              const answer = getAnswerForQuestion(
                                response,
                                question.id
                              );
                              return (
                                <div
                                  key={question.id}
                                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                                >
                                  <div className="mb-4">
                                    <div className="flex items-start space-x-3 mb-3">
                                      <span className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {index + 1}
                                      </span>
                                      <div className="flex-1">
                                        <h6 className="text-lg font-semibold text-gray-900 mb-2">
                                          {question.question}
                                        </h6>
                                        {question.image && (
                                          <img
                                            src={question.image}
                                            alt="Question"
                                            className="max-w-xs max-h-32 object-cover rounded-lg shadow-md border border-gray-300 mb-3"
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="ml-11">
                                    <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                                      <p className="text-sm font-medium text-gray-700 mb-2">
                                        Answer:
                                      </p>
                                      <div className="text-gray-900">
                                        {renderDetailedAnswer(question, answer)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function to render detailed answers
const renderDetailedAnswer = (question, answer) => {
  if (!answer) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
        <svg
          className="h-4 w-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        No answer provided
      </span>
    );
  }

  switch (question.type) {
    case "categorize":
      return (
        <div className="space-y-2">
          {Object.entries(answer).map(([item, category]) => (
            <div
              key={item}
              className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border border-blue-200"
            >
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {item}
              </span>
              <svg
                className="h-4 w-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <span className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
                {category}
              </span>
            </div>
          ))}
        </div>
      );

    case "cloze":
      return (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm font-medium text-green-800 mb-2">
              Original Sentence:
            </p>
            <p className="text-green-900 font-mono bg-white p-2 rounded border">
              {question.sentence}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Filled Blanks:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {answer.map((ans, index) => (
                <div
                  key={index}
                  className="bg-green-50 rounded-lg p-3 border border-green-200"
                >
                  <span className="text-green-600 text-sm font-medium">
                    Blank {index + 1}:
                  </span>
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                    {ans}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "comprehension":
      return (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm font-medium text-purple-800 mb-2">
              Reading Passage:
            </p>
            <p className="text-purple-900 text-sm leading-relaxed">
              {question.passage.length > 200
                ? `${question.passage.substring(0, 200)}...`
                : question.passage}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Question Responses:
            </p>
            {question.mcqs.map((mcq, index) => {
              const isCorrect = answer[index] === mcq.correct;
              return (
                <div
                  key={index}
                  className={`rounded-lg p-4 border-2 ${
                    isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-medium text-gray-900 flex-1">
                      <span className="text-purple-600">Q{index + 1}:</span>{" "}
                      {mcq.question}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Selected Answer:
                      </p>
                      <p
                        className={`px-3 py-1 rounded ${
                          isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {mcq.options[answer[index]] || "Not answered"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Correct Answer:
                      </p>
                      <p className="bg-green-100 text-green-800 px-3 py-1 rounded">
                        {mcq.options[mcq.correct]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    default:
      return (
        <pre className="bg-gray-100 rounded-lg p-4 text-sm text-gray-800 overflow-x-auto border border-gray-200">
          {JSON.stringify(answer, null, 2)}
        </pre>
      );
  }
};

export default ResponseTable;
