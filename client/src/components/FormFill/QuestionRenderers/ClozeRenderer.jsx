import { useState, useEffect, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define drag item types
const ItemTypes = {
  OPTION: "option",
};

// Draggable Option Component
const DraggableOption = ({ option, index, isUsed, onReturn }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.OPTION,
      item: { option, sourceIndex: index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: !isUsed,
    }),
    [option, index, isUsed]
  );

  return (
    <div
      ref={drag}
      className={`inline-flex items-center px-4 py-2 m-1 rounded-full text-sm font-medium transition-all duration-200 ${
        isDragging
          ? "opacity-50 transform scale-95"
          : isUsed
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-md transform hover:scale-105 cursor-grab"
      }`}
    >
      {!isUsed && (
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
            d="M7 16V4m0 0L3 8m4-4l4 4"
          />
        </svg>
      )}
      <span>{option}</span>
      {isUsed && (
        <button
          onClick={() => onReturn(option)}
          className="ml-2 text-gray-600 hover:text-gray-800"
          title="Click to return this option"
        >
          <svg
            className="h-3 w-3"
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
  );
};

// Drop Zone for Blank Fields
const BlankDropZone = ({ blankIndex, selectedOption, onDrop, onClear }) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.OPTION,
      drop: (item, monitor) => {
        console.log("Dropping item:", item, "into blank:", blankIndex);
        if (monitor.didDrop()) {
          return;
        }
        onDrop(blankIndex, item.option);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [blankIndex, onDrop]
  );

  const isEmpty = !selectedOption || selectedOption === "";
  const isActive = isOver && canDrop;

  return (
    <span
      ref={drop}
      className={`inline-flex items-center min-w-24 min-h-8 mx-2 px-3 py-1 rounded-lg transition-all duration-200 border-2 ${
        isActive
          ? "border-green-400 bg-green-100 shadow-lg scale-105"
          : isEmpty
          ? "border-dashed border-gray-400 bg-gray-50 hover:border-green-400 hover:bg-green-50"
          : "border-green-400 bg-green-100"
      } cursor-pointer`}
    >
      {isEmpty ? (
        <span className="text-gray-500 text-sm italic flex items-center">
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
          Drop here
        </span>
      ) : (
        <span className="text-green-800 font-semibold flex items-center">
          {selectedOption}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear(blankIndex);
            }}
            className="ml-2 text-green-600 hover:text-green-800 transition-colors duration-200"
            title="Remove this option"
          >
            <svg
              className="h-3 w-3"
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
        </span>
      )}
    </span>
  );
};

// Main ClozeRenderer Component - FIXED DATA STRUCTURE
const ClozeRendererContent = ({
  question,
  answer,
  onAnswerChange,
  questionNumber,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [blankCount, setBlankCount] = useState(0);

  // FIXED: Get the sentence from the correct field
  const getSentenceWithBlanks = () => {
    // Try different possible field names for the sentence
    return question.sentence || question.question || "";
  };

  // Initialize state from question and answer - FIXED VERSION
  useEffect(() => {
    const sentence = getSentenceWithBlanks();
    const parts = sentence.split("__");
    const count = parts.length - 1;

    console.log("FIXED - Initializing cloze question:", {
      sentence,
      count,
      answer,
      questionObject: question,
    });

    setBlankCount(count);

    if (answer && Array.isArray(answer) && answer.length === count) {
      setSelectedOptions(answer);
    } else {
      const initialOptions = Array(count).fill("");
      setSelectedOptions(initialOptions);
      onAnswerChange(initialOptions);
    }
  }, [question]); // Watch the entire question object

  // Handle dropping an option into a blank
  const handleDrop = useCallback(
    (blankIndex, option) => {
      console.log("handleDrop called:", { blankIndex, option });

      setSelectedOptions((prevOptions) => {
        const newSelections = [...prevOptions];

        // If this option is already used elsewhere, clear it first
        const existingIndex = newSelections.indexOf(option);
        if (existingIndex !== -1 && existingIndex !== blankIndex) {
          newSelections[existingIndex] = "";
        }

        newSelections[blankIndex] = option;
        console.log("New selections:", newSelections);

        // Update parent component
        onAnswerChange(newSelections);

        return newSelections;
      });
    },
    [onAnswerChange]
  );

  // Handle clearing a blank
  const handleClear = useCallback(
    (blankIndex) => {
      console.log("handleClear called:", { blankIndex });

      setSelectedOptions((prevOptions) => {
        const newSelections = [...prevOptions];
        newSelections[blankIndex] = "";

        // Update parent component
        onAnswerChange(newSelections);

        return newSelections;
      });
    },
    [onAnswerChange]
  );

  // Handle returning an option to the available pool
  const handleReturn = useCallback(
    (option) => {
      setSelectedOptions((prevOptions) => {
        const newSelections = prevOptions.map((selected) =>
          selected === option ? "" : selected
        );

        // Update parent component
        onAnswerChange(newSelections);

        return newSelections;
      });
    },
    [onAnswerChange]
  );

  // Check if an option is currently used
  const isOptionUsed = (option) => {
    return selectedOptions.includes(option);
  };

  const renderSentenceWithBlanks = () => {
    const sentence = getSentenceWithBlanks();
    const parts = sentence.split("__");
    const result = [];

    parts.forEach((part, index) => {
      result.push(
        <span key={`text-${index}`} className="text-gray-800">
          {part}
        </span>
      );

      if (index < parts.length - 1) {
        result.push(
          <BlankDropZone
            key={`blank-${index}`}
            blankIndex={index}
            selectedOption={selectedOptions[index] || ""}
            onDrop={handleDrop}
            onClear={handleClear}
          />
        );
      }
    });

    return result;
  };

  const getUsedOptions = () => {
    return selectedOptions.filter((option) => option && option.trim() !== "");
  };

  return (
    <div className="bg-white border-2 border-green-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Question {questionNumber}
            </h3>
            <p className="text-green-100 text-sm">Drag & Drop to Fill Blanks</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Enhanced Debug Info */}
        {/* <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <strong>Debug Info:</strong>
          <br />- Sentence: "{getSentenceWithBlanks()}"<br />- Blank Count:{" "}
          {blankCount}
          <br />- Selected: [{selectedOptions.join(", ")}]<br />- Available
          Options: [{(question.options || []).join(", ")}]<br />- Question
          Fields: [{Object.keys(question).join(", ")}]
        </div> */}

        {/* Show error if no blanks found */}
        {blankCount === 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <strong>Error:</strong> No blanks found in sentence. Make sure the
            sentence contains "__ " (2 underscores).
          </div>
        )}

        {/* Question Title - if different from sentence */}
        {question.title && question.title !== getSentenceWithBlanks() && (
          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-900 mb-4">
              {question.title}
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
        )}

        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-green-600"
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
            <p className="text-green-800 font-medium">
              Instructions: Drag the options below and drop them into the blank
              spaces in the sentence.
            </p>
          </div>
        </div>

        {/* Sentence with Drop Zones */}
        {blankCount > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Complete the sentence:
            </h4>
            <div className="text-lg leading-relaxed bg-white rounded-lg p-4 border border-green-200 shadow-sm">
              {renderSentenceWithBlanks()}
            </div>
          </div>
        )}

        {/* Available Options */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg
              className="h-5 w-5 mr-2 text-green-600"
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
            Available Options:
          </h4>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-20">
            {question.options && question.options.length > 0 ? (
              <div className="flex flex-wrap">
                {question.options.map((option, index) => (
                  <DraggableOption
                    key={`${option}-${index}`}
                    option={option}
                    index={index}
                    isUsed={isOptionUsed(option)}
                    onReturn={handleReturn}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No options available for this question.
              </div>
            )}

            {/* All used state */}
            {question.options &&
              question.options.length > 0 &&
              question.options.every((option) => isOptionUsed(option)) && (
                <div className="text-center py-4">
                  <div className="text-gray-500 text-sm italic">
                    All options have been used! 🎉
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Progress Indicator */}
        {blankCount > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-800 font-medium">Progress</span>
              <span className="text-green-600 font-semibold">
                {getUsedOptions().length} / {blankCount} blanks filled
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${(getUsedOptions().length / blankCount) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component with DndProvider
const ClozeRenderer = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ClozeRendererContent {...props} />
    </DndProvider>
  );
};

export default ClozeRenderer;
