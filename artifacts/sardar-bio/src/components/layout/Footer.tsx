import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100 mt-24">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight mb-4 inline-block">
            SARDAR BIO
          </Link>
          <p className="text-gray-600 max-w-sm leading-relaxed mt-4">
            Premium organic farming wholesale company operating since 2004. Quality bio pesticides, insecticides, and fungicides for professional agriculture.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Explore</h4>
          <div className="flex flex-col gap-3 text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors w-fit">Home</Link>
            <Link href="/products" className="hover:text-primary transition-colors w-fit">Products</Link>
            <Link href="/dealers" className="hover:text-primary transition-colors w-fit">Find a Dealer</Link>
            <Link href="/contact" className="hover:text-primary transition-colors w-fit">Contact Us</Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Contact</h4>
          <div className="flex flex-col gap-3 text-gray-600 text-sm">
            <p>123 Agri Business Park<br/>Gujarat, India 380001</p>
            <p className="mt-2">info@sardarbio.com</p>
            <p>+91 98765 43210</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Sardar Bio Organic. All rights reserved.</p>
        <Link href="/admin" className="mt-4 md:mt-0 hover:text-gray-900 transition-colors">Admin Portal</Link>
      </div>
    </footer>
  );
}
