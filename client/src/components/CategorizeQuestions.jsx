import React, { useState } from "react";
import { Trash2, CirclePlus } from "lucide-react";

const CategorizeQuestion = ({ question, onUpdate, onRemove }) => {
  // Use optional chaining for safe access to question.content
  const content = question?.content || {
    questionText: "",
    categories: [],
    items: [],
  };

  const [newCategory, setNewCategory] = useState("");
  const [newItemText, setNewItemText] = useState("");

  // Handlers for adding/removing categories
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const updatedCategories = [...content.categories, newCategory.trim()];
      onUpdate({ ...content, categories: updatedCategories });
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    const updatedCategories = content.categories.filter(
      (cat) => cat !== categoryToRemove
    );
    // Also remove items that belong to this category
    const updatedItems = content.items.filter(
      (item) => item.category !== categoryToRemove
    );
    onUpdate({
      ...content,
      categories: updatedCategories,
      items: updatedItems,
    });
  };

  // Handlers for adding/removing items
  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now(),
        text: newItemText.trim(),
        category: "", // Initially unassigned
      };
      const updatedItems = [...content.items, newItem];
      onUpdate({ ...content, items: updatedItems });
      setNewItemText("");
    }
  };

  const handleUpdateItemCategory = (itemId, newCategory) => {
    const updatedItems = content.items.map((item) =>
      item.id === itemId ? { ...item, category: newCategory } : item
    );
    onUpdate({ ...content, items: updatedItems });
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = content.items.filter((item) => item.id !== itemId);
    onUpdate({ ...content, items: updatedItems });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Categorize Question
        </h4>
        <button
          onClick={() => onRemove(question.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove question"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Question Text Input */}
      <textarea
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 mb-4 text-gray-700"
        rows="2"
        placeholder="Enter your question text here..."
        value={content.questionText}
        onChange={(e) => onUpdate({ ...content, questionText: e.target.value })}
      />

      {/* Categories Section */}
      <div className="mb-6">
        <h5 className="font-medium text-gray-800 mb-2">Categories</h5>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add a new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <CirclePlus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.categories?.map((category, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center space-x-1"
            >
              <span>{category}</span>
              <button
                onClick={() => handleRemoveCategory(category)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Items Section */}
      <div>
        <h5 className="font-medium text-gray-800 mb-2">Items to Categorize</h5>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add a new item"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          />
          <button
            onClick={handleAddItem}
            className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <CirclePlus size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {content.items?.map((item) => (
            <div
              key={item.id}
              className="bg-gray-100 p-3 rounded-lg flex items-center justify-between"
            >
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-gray-700">{item.text}</span>
                <select
                  value={item.category}
                  onChange={(e) =>
                    handleUpdateItemCategory(item.id, e.target.value)
                  }
                  className="p-1 rounded-lg border border-gray-300 text-gray-700"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {content.categories?.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-4"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorizeQuestion;
