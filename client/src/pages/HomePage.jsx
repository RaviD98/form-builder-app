import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();
  const [myForms, setMyForms] = useState([]);

  useEffect(() => {
    const savedForms = JSON.parse(
      localStorage.getItem("myCreatedForms") || "[]"
    );
    setMyForms(savedForms);
  }, []);

  const handleCreateForm = () => {
    navigate("/builder");
  };

  const handleMyForms = () => {
    if (myForms.length === 0) {
      alert("You haven't created any forms yet. Create your first form!");
      navigate("/builder");
    } else {
      navigate("/my-forms");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <Navbar showMyForms={myForms.length > 0} onMyFormsClick={handleMyForms} />

      {/* Hero Section */}
      <div className="relative overflow-hidden mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 px-4 sm:px-6 lg:px-8">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Build beautiful forms</span>{" "}
                <span className="block text-blue-600 xl:inline">
                  in minutes
                </span>
              </h1>

              <p className=" text-lg text-gray-600 sm:max-w-xl sm:mx-auto lg:mx-0 mt-15">
                The simple way to create custom, innovative forms. Capture data
                and create interactive experiences with a powerful, yet
                easy-to-use form builder. No code required.
              </p>

              {/* Call to Action Buttons */}
              <div className="mt-18 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center lg:justify-start">
                <button
                  onClick={handleCreateForm}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  <svg
                    className="h-5 w-5 mr-2"
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

                {/* My Forms button*/}
                <button
                  onClick={handleMyForms}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-700 md:py-4 md:text-lg md:px-10 transition duration-200 transform hover:scale-105 shadow-md cursor-pointer"
                >
                  <svg
                    className="h-5 w-5 mr-2"
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
                  {myForms.length > 0
                    ? `My Forms (${myForms.length})`
                    : "My Forms"}
                </button>
              </div>
            </div>

            {/* Right Column - Hero Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <svg
                  className="h-64 w-64 sm:h-80 sm:w-80 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className=" inset-0 flex items-center justify-center">
                  <div className="text-blue-600 text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      Three Question Types
                    </h3>
                    <p className="text-black font-bold">
                      Categorize • Cloze • Comprehension
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section*/}
      <div className="py-16 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className=" text-blue-600 font-semibold tracking-wide uppercase text-2xl">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to build forms
            </p>
          </div>

          <div className="space-y-16">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8">
                  <svg
                    className="h-24 w-24 text-blue-600"
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
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Drag & Drop Interface
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Intuitive drag-and-drop functionality for categorize and cloze
                  questions. Create interactive forms where users can drag items
                  into categories or drag words into blanks seamlessly.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-30">
              <div className="text-center lg:text-left lg:order-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Cloud Image Support
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Add stunning images to your forms and questions with
                  integrated cloud storage. Upload once, use everywhere with
                  automatic optimization and fast loading times.
                </p>
              </div>
              <div className="flex justify-center lg:order-2">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8">
                  <svg
                    className="h-24 w-24 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-30">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-8">
                  <svg
                    className="h-24 w-24 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Response Analytics
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  View responses in beautiful, interactive tables and export
                  your data to CSV format. Get insights into user behavior and
                  form performance with detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plus Points Section */}
      <div className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Why Choose FormEZ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover what makes FormEZ the perfect choice for creating
              engaging, interactive forms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Plus Point 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-indigo-100 rounded-full p-4">
                  <svg
                    className="h-12 w-12 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Simple Design
              </h3>
              <p className="text-gray-600">
                Clean, intuitive interface that makes form building effortless
                and enjoyable.
              </p>
            </div>

            {/* Plus Point 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4">
                  <svg
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Easy to Use
              </h3>
              <p className="text-gray-600">
                No coding required. Create professional forms in minutes with
                our user-friendly tools.
              </p>
            </div>

            {/* Plus Point 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-purple-100 rounded-full p-4">
                  <svg
                    className="h-12 w-12 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Powerful Features
              </h3>
              <p className="text-gray-600">
                Advanced question types with interactive elements that engage
                your audience.
              </p>
            </div>

            {/* Plus Point 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-pink-100 rounded-full p-4">
                  <svg
                    className="h-12 w-12 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Responsive
              </h3>
              <p className="text-gray-600">
                Forms look great and work perfectly on all devices - mobile,
                tablet, and desktop.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 bg-gradient-to-r from-green-300 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to create your first form?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already creating amazing forms with
            FormEZ
          </p>
          <button
            onClick={handleCreateForm}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            <svg
              className="h-6 w-6 mr-2"
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
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
