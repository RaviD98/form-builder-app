import { SquarePen, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="p-4 md:p-6 bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/App Name */}
        <div className="flex items-center space-x-2">
          <SquarePen className="w-6 h-6 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">Form Builder</span>
        </div>

        {/* Navigation Links (Hidden on small screens) */}
        <nav className="hidden md:flex space-x-8 font-medium">
          <a href="#" className="hover:text-indigo-600 transition-colors">
            Features
          </a>
          <a href="#" className="hover:text-indigo-600 transition-colors">
            Pricing
          </a>
          <a href="#" className="hover:text-indigo-600 transition-colors">
            Support
          </a>
        </nav>

        {/* Call to Action Buttons */}
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="hidden md:block text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            Log in
          </a>
          <button className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-indigo-800 transition-colors cursor-pointer">
            Sign Up
          </button>
          <button className="md:hidden text-gray-600 hover:text-indigo-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
