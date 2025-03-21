import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <img
                src="https://d51e583nnuf2e.cloudfront.net/Frontend/assets/img/logo-in-circle.svg"
                width="50"
                alt="Logo"
                className="mr-3"
              />
              <a href="/" className="text-white hover:text-gray-300 transition-colors">
                CodeMitra Institute
              </a>
            </h2>
            <p className="text-gray-400 mb-6">A Program - Empowering Education & Technology.</p>
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors block">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors block">
                  About Us
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-400 hover:text-white transition-colors block">
                  Courses
                </a>
              </li>
              <li>
                <a href="/admissions" className="text-gray-400 hover:text-white transition-colors block">
                  Admissions
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors block">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <p className="text-gray-400">
              <strong>Phone:</strong> +91 00010209247
            </p>
            <p className="text-gray-400">
              <strong>Email:</strong>{' '}
              <a href="mailto:info@codemitra.org" className="text-white hover:text-gray-300 transition-colors">
                info@codemitra.org
              </a>
            </p>
            <p className="text-gray-400">
              <strong>Location:</strong> Honey Avenue, Delhi, 100201
            </p>
          </div>
        </div>

        <hr className="border-gray-700 my-5" />
        <p className="text-center text-gray-400 h-auto">
          © {new Date().getFullYear()} CodeMitra Institute. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;