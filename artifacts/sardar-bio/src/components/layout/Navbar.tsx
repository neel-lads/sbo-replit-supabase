import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/dealers", label: "Dealers" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight">
          SARDAR BIO
        </Link>
        
        {/* Desktop */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm tracking-wide hover:text-primary transition-colors ${location === link.href ? "text-primary font-medium" : "text-gray-600"}`}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none shadow-none uppercase text-xs tracking-wider font-semibold px-6" asChild>
            <Link href="/contact">Enquire Now</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-4">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-lg font-medium p-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
