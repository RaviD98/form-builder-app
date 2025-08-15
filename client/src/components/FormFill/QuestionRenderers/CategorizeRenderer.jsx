const CategorizeRenderer = ({
  question,
  answer,
  onAnswerChange,
  questionNumber,
}) => {
  const handleItemCategoryChange = (item, category) => {
    const newAnswer = {
      ...answer,
      [item]: category,
    };
    onAnswerChange(newAnswer);
  };

  return (
    <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-lg p-2">
            <svg
              className="h-6 w-6 text-white"
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
          <div>
            <h3 className="text-lg font-bold text-white">
              Question {questionNumber}
            </h3>
            <p className="text-blue-100 text-sm">Categorization Task</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Question Text */}
        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-900 mb-4">
            {question.question}
          </p>
          {question.image && (
            <div className="flex justify-center mb-4">
              <img
                src={question.image}
                alt="Question"
                className="max-w-md max-h-64 object-cover rounded-lg shadow-md border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-blue-800 font-medium">
              Instructions: Select the appropriate category for each item using
              the dropdown menus.
            </p>
          </div>
        </div>

        {/* Categories Display */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Categories:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {question.categories.map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
              >
                <h5 className="font-semibold text-blue-800 mb-2">{category}</h5>
                <div className="space-y-2">
                  {question.items
                    .filter((item) => answer[item] === category)
                    .map((item) => (
                      <div
                        key={item}
                        className="bg-white border border-blue-200 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm"
                      >
                        {item}
                      </div>
                    ))}
                  {question.items.filter((item) => answer[item] === category)
                    .length === 0 && (
                    <div className="text-gray-400 text-sm italic text-center py-2">
                      No items assigned yet
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items to Categorize */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Items to Categorize:
          </h4>
          <div className="space-y-3">
            {question.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-gray-800 font-medium">{item}</span>
                </div>
                <select
                  value={answer[item] || ""}
                  onChange={(e) =>
                    handleItemCategoryChange(item, e.target.value)
                  }
                  className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                    answer[item]
                      ? "border-green-300 bg-green-50 text-green-800"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  <option value="" className="text-gray-500">
                    Select Category
                  </option>
                  {question.categories.map((category, catIndex) => (
                    <option
                      key={catIndex}
                      value={category}
                      className="text-gray-800"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-800 font-medium">Progress</span>
            <span className="text-blue-600 font-semibold">
              {Object.keys(answer).length} / {question.items.length} items
              categorized
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (Object.keys(answer).length / question.items.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorizeRenderer;
