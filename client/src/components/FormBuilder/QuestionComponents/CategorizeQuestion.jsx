import ImageUpload from "../../common/ImageUpload";
import { formAPI } from "../../../services/api";

const CategorizeQuestion = ({ question, onUpdate, onRemove }) => {
  // Add safety checks and default values
  const categories = question.categories || [""];
  const items = question.items || [""];

  const handleImageUpload = async (file) => {
    try {
      const response = await formAPI.uploadImage(file);
      if (response.data.success) {
        onUpdate({ image: response.data.data.url });
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  };

  const updateCategories = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    onUpdate({ categories: newCategories });
  };

  const addCategory = () => {
    onUpdate({ categories: [...categories, ""] });
  };

  const removeCategory = (index) => {
    if (categories.length > 1) {
      const newCategories = categories.filter((_, i) => i !== index);
      onUpdate({ categories: newCategories });
    }
  };

  const updateItems = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate({ items: newItems });
  };

  const addItem = () => {
    onUpdate({ items: [...items, ""] });
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      onUpdate({ items: newItems });
    }
  };

  return (
    <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
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
                Categorize Question
              </h3>
              <p className="text-blue-100 text-sm">
                Drag and drop items into categories
              </p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-200 transform hover:scale-105"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Question Text */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Question Title
          </label>
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) => onUpdate({ question: e.target.value })}
            placeholder="Enter your categorization question..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Question Image */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Question Image (Optional)
          </label>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
            <ImageUpload
              onUpload={handleImageUpload}
              currentImage={question.image || ""}
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">
              Categories
            </label>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {categories.length} category
              {categories.length !== 1 ? "ies" : "y"}
            </span>
          </div>

          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <div className="flex-1">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => updateCategories(index, e.target.value)}
                    placeholder={`Category ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>
                {categories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-all duration-200"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCategory}
            className="w-full py-2 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition duration-200 flex items-center justify-center space-x-2"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="font-medium">Add Category</span>
          </button>
        </div>

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">
              Items to Categorize
            </label>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItems(index, e.target.value)}
                    placeholder={`Item ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-all duration-200"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="w-full py-2 px-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 hover:border-green-400 transition duration-200 flex items-center justify-center space-x-2"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="font-medium">Add Item</span>
          </button>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="h-5 w-5 mr-2 text-blue-500"
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
            Preview
          </h4>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="font-medium text-gray-900 mb-2">
              {question.question || "Your question here"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-semibold text-gray-600 mb-2">
                  Categories:
                </h5>
                <ul className="space-y-1">
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {category || `Category ${index + 1}`}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-600 mb-2">
                  Items:
                </h5>
                <ul className="space-y-1">
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      {item || `Item ${index + 1}`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorizeQuestion;
