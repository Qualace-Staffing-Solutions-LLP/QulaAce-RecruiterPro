const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-purple-700 text-white py-8 font-poppins">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center">
        {/* Image on the left */}
        <div className="flex-shrink-0 mr-4 mb-6 md:mb-0">
          <img
            src="Qualace Logo.jpg" // Update with your image path
            alt="Qualace Staffing Solutions Logo"
            className="w-20 h-20 md:w-32 md:h-32  rounded-lg" // rounded-lg to round the edges
          />
        </div>

        {/* Text content */}
        <div className="text-center md:text-left">
          <div className="mb-6">
            <p className="text-lg font-semibold">Qualace Staffing Solutions</p>
            <p className="text-sm mt-2">
              Empowering organizations with top-tier talent solutions.
            </p>
          </div>

          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="https://www.instagram.com/qualace_ss/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram text-white text-2xl hover:text-gray-300 transition duration-300"></i>
            </a>
            <a
              href="https://x.com/Qualace_SS"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter text-white text-2xl hover:text-gray-300 transition duration-300"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/qualace-staffing-solutions-llp-981852332/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in text-white text-2xl hover:text-gray-300 transition duration-300"></i>
            </a>
          </div>

          <div className="text-sm text-gray-300">
            <p>
              &copy; {new Date().getFullYear()} Qualace Staffing Solutions LLP.
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
