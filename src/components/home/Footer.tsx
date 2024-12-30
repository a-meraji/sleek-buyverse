import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">About Us</h3>
            <p className="text-sm text-gray-300">
              We're dedicated to bringing you the finest quality products with
              exceptional style and comfort.
            </p>
            <Link to="/about" className="text-[#1d8757] hover:underline">
              Learn More
            </Link>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>Contact Us</li>
              <li>Shipping Policy</li>
              <li>Returns & Exchanges</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>New Arrivals</li>
              <li>Popular Products</li>
              <li>Special Offers</li>
              <li>Gift Cards</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Developer</h3>
            <p className="text-sm text-gray-300">
              Designed and developed by{" "}
              <a
                href="https://aminmeraji.iran.liara.run/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1d8757] hover:underline"
              >
                Amin Meraji
              </a>
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/a-meraji/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/amin-meraji/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:merajiamin1997@gmail.com"
                className="text-gray-300 hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Your Store Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
