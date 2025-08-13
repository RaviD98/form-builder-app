import { SquarePen, MessageSquarePlus, ArrowRight, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
// Main App component representing the homepage
const App = () => {
    const navigate = useNavigate();
    
  return (
    <div className="h-screen bg-gray-50 text-gray-800 font-sans antialiased flex flex-col">
      {/* Header/Navigation Bar */}

      {/* Main Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-32 flex flex-col items-center text-center">
        {/* Subtitle/Tagline */}
        <h2 className="text-sm md:text-base font-semibold tracking-wide text-indigo-600 uppercase mb-2">
          Build beautiful forms in minutes
        </h2>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 max-w-4xl">
          The simple way to create custom, innovative forms.
        </h1>

        {/* Description */}
        <p className="text-base md:text-xl text-gray-600 max-w-2xl mb-10">
          Capture data and create interactive experiences with a powerful, yet
          easy-to-use form builder. No code required.
        </p>

        {/* Primary Call to Action Button */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate("/builder")}
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:bg-indigo-800 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 cursor-pointer"
          >
            <span>Create your first form</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Feature Section (Example) */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Why choose our Form Builder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="p-6 md:p-8 bg-gray-50 rounded-2xl shadow-md transition-shadow hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <MessageSquarePlus className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Three unique question types
              </h3>
              <p className="text-gray-600">
                Go beyond simple multiple choice with Categorize, Cloze, and
                Comprehension questions.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 md:p-8 bg-gray-50 rounded-2xl shadow-md transition-shadow hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <SquarePen className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Intuitive drag-and-drop editor
              </h3>
              <p className="text-gray-600">
                Easily reorder questions and add new content with a seamless,
                visual interface.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 md:p-8 bg-gray-50 rounded-2xl shadow-md transition-shadow hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <img
                  src="https://placehold.co/100x100/A5B4FC/3730A3?text=Images"
                  alt="Images in forms icon"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Add images with ease
              </h3>
              <p className="text-gray-600">
                Enhance your questions with images and personalize your forms
                with a header image.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;

// import React from "react";
// import { SquarePen, MessageSquarePlus, ArrowRight, Menu } from "lucide-react";

// // Main App component representing the homepage
// const App = () => {
//   return (
//     // We removed 'h-screen' and 'overflow-hidden' to allow the page to scroll.
//     // The scrollbar will be hidden using the CSS in the style tag.
//     <div className="bg-gray-50 text-gray-800 font-sans antialiased flex flex-col">
//       {/*
//         This style block uses the -webkit-scrollbar pseudo-element to make the scrollbar
//         invisible while keeping the page scrollable. This is a common way to achieve
//         an aesthetic where the scrollbar is hidden.
//       */}
//       <style>
//         {`
//           /* Hide scrollbar for Chrome, Safari and Opera */
//           body::-webkit-scrollbar {
//             display: none;
//           }

//           /* Hide scrollbar for IE, Edge and Firefox */
//           body {
//             -ms-overflow-style: none;  /* IE and Edge */
//             scrollbar-width: none;  /* Firefox */
//           }
//         `}
//       </style>

//       {/* Header/Navigation Bar */}
//       <header className="p-4 md:p-6 bg-white shadow-sm sticky top-0 z-50">
//         <div className="container mx-auto flex justify-between items-center">
//           {/* Logo/App Name */}
//           <div className="flex items-center space-x-2">
//             <SquarePen className="w-6 h-6 text-indigo-600" />
//             <span className="text-xl font-bold text-gray-900">
//               Form Builder
//             </span>
//           </div>

//           {/* Navigation Links (Hidden on small screens) */}
//           <nav className="hidden md:flex space-x-8 font-medium">
//             <a href="#" className="hover:text-indigo-600 transition-colors">
//               Features
//             </a>
//             <a href="#" className="hover:text-indigo-600 transition-colors">
//               Pricing
//             </a>
//             <a href="#" className="hover:text-indigo-600 transition-colors">
//               Support
//             </a>
//           </nav>

//           {/* Call to Action Buttons */}
//           <div className="flex items-center space-x-4">
//             <a
//               href="#"
//               className="hidden md:block text-gray-600 hover:text-indigo-600 font-medium transition-colors"
//             >
//               Log in
//             </a>
//             <button className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
//               Sign Up
//             </button>
//             <button className="md:hidden text-gray-600 hover:text-indigo-600">
//               <Menu className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Hero Section */}
//       <main className="container mx-auto px-4 py-16 md:py-32 flex flex-col items-center text-center">
//         {/* Subtitle/Tagline */}
//         <h2 className="text-sm md:text-base font-semibold tracking-wide text-indigo-600 uppercase mb-2">
//           Build beautiful forms in minutes
//         </h2>

//         {/* Hero Title */}
//         <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 max-w-4xl">
//           The simple way to create custom, innovative forms.
//         </h1>

//         {/* Description */}
//         <p className="text-base md:text-xl text-gray-600 max-w-2xl mb-10">
//           Capture data and create interactive experiences with a powerful, yet
//           easy-to-use form builder. No code required.
//         </p>

//         {/* Primary Call to Action Button */}
//         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
//           <button className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
//             <span>Create your first form</span>
//             <ArrowRight className="w-5 h-5" />
//           </button>
//         </div>
//       </main>

//       {/* Feature Section (Example) */}
//       <section className="bg-white py-16 md:py-24">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
//             Why choose our Form Builder?
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {/* Feature Card 1 */}
//             <div className="p-6 md:p-8 bg-gray-50 rounded-2xl shadow-md transition-shadow hover:shadow-xl">
//               <div className="flex justify-center mb-4">
//                 <MessageSquarePlus className="w-12 h-12 text-indigo-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">
//                 Three unique question types
//               </h3>
//               <p className="text-gray-600">
//                 Go beyond simple multiple choice with Categorize, Cloze, and
//                 Comprehension questions.
//               </p>
//             </div>

//             {/* Feature Card 2 */}
//             <div className="p-6 md:p-8 bg-gray-50 rounded-2xl shadow-md transition-shadow hover:shadow-xl">
//               <div className="flex justify-center mb-4">
//                 <SquarePen className="w-12 h-12 text-indigo-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">
//                 Intuitive drag-and-drop editor
//               </h3>
//               <p className="text-gray-600">
//                 Easily reorder questions and add new content with a seamless,
//                 visual interface.
//               </p>
//             </div>

//             {/* Feature Card 3 */}
//             <div className="p-6 md:p-8 bg-gray-50 rounded-2xl shadow-md transition-shadow hover:shadow-xl">
//               <div className="flex justify-center mb-4">
//                 <img
//                   src="https://placehold.co/100x100/A5B4FC/3730A3?text=Images"
//                   alt="Images in forms icon"
//                   className="w-12 h-12 rounded-full"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">
//                 Add images with ease
//               </h3>
//               <p className="text-gray-600">
//                 Enhance your questions with images and personalize your forms
//                 with a header image.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default App;
