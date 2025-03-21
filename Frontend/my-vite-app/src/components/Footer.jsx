import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <h2 className="mb-3 d-flex align-items-center">
              <img src="https://d51e583nnuf2e.cloudfront.net/Frontend/assets/img/logo-in-circle.svg" width="50" alt="Logo" />
              <a href="/" className="ml-3 text-white">CodeMitra Institute</a>
            </h2>
            <p>A Program - Empowering Education & Technology.</p>
            <h4 className="mt-4">Follow Us</h4>
            <div>
              <a href="#" className="text-white mr-3"><i className="fa fa-facebook"></i></a>
              <a href="#" className="text-white mr-3"><i className="fa fa-twitter"></i></a>
              <a href="#" className="text-white mr-3"><i className="fa fa-linkedin"></i></a>
              <a href="#" className="text-white"><i className="fa fa-youtube"></i></a>
            </div>
          </div>


          <div className="col-lg-4 col-md-6">
            <h4 className="mb-3">Quick Links</h4>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/about" className="text-white">About Us</a></li>
              <li><a href="/courses" className="text-white">Courses</a></li>
              <li><a href="/admissions" className="text-white">Admissions</a></li>
              <li><a href="/contact" className="text-white">Contact Us</a></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <h4 className="mb-3">Contact Info</h4>
            <p><strong>Phone:</strong> +91 00010209247</p>
            <p><strong>Email:</strong> <a href="mailto:info@codemitra.org" className="text-white">info@codemitra.org</a></p>
            <p><strong>Location:</strong> Honey Avenue, Delhi, 100201</p>
          </div>
        </div>
        
        <hr className="bg-white"/>
        <p className="text-center mt-3">© {new Date().getFullYear()} CodeMitra Institute. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
