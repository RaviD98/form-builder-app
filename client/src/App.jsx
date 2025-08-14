import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RootLayout from "./Layouts/RootLayout";
import FormBuilder from "./components/FormBuilder/FormBuilder";
import FormFill from "./components/FormFill/FormFill";
import FormResponses from "./components/FormResponses/FormResponses";
import FormPreview from "./components/FormBuilder/FormPreview";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/builder",
        element: <FormBuilder />,
      },
      {
        path: "/form-fill/:id",
        element: <FormFill />,
      },
      {
        path: "/form-preview/:id", // NEW: Preview route
        element: <FormPreview />,
      },
      {
        path: "/form-responses/:formId",
        element: <FormResponses />,
      },
      // 404 fallback route
      {
        path: "*",
        element: (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Page Not Found
              </h2>
              <p className="text-gray-600">
                The page you're looking for doesn't exist.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
]);

const App = () => {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
};

export default App;
