import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/SARADAR BIO LOGO.svg";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/dealers", label: "Dealers" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src={logo} alt="Sardar Bio Organic" className="h-8 md:h-10 w-auto object-contain"/>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors ${
                location === link.href
                  ? "text-[#00C62C] font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={`text-sm font-semibold px-5 py-2 rounded-full transition-all ${
              location === "/contact"
                ? "bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white shadow-md shadow-green-200"
                : "bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white hover:opacity-90 shadow-sm hover:shadow-md hover:shadow-green-200"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 p-5 flex flex-col gap-3 shadow-xl animate-in slide-in-from-top-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium px-3 py-2 rounded-xl transition-colors ${
                location === link.href ? "bg-green-50 text-[#00C62C]" : "hover:bg-gray-50 text-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-sm font-semibold text-center py-3 rounded-full bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white mt-1"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}
