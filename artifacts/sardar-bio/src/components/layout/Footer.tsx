import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight mb-4 inline-block">
            Sardar Bio
          </Link>
          <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[#00C62C] to-[#00a325] mt-3 mb-4" />
          <p className="text-gray-400 max-w-sm leading-relaxed">
            Premium organic farming wholesale company operating since 2004. Quality bio pesticides, insecticides, and fungicides for professional agriculture.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-6 text-white">Explore</h4>
          <div className="flex flex-col gap-3 text-gray-400">
            <Link href="/" className="hover:text-[#00C62C] transition-colors w-fit text-sm">Home</Link>
            <Link href="/products" className="hover:text-[#00C62C] transition-colors w-fit text-sm">Products</Link>
            <Link href="/dealers" className="hover:text-[#00C62C] transition-colors w-fit text-sm">Find a Dealer</Link>
            <Link href="/contact" className="hover:text-[#00C62C] transition-colors w-fit text-sm">Contact Us</Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-6 text-white">Contact</h4>
          <div className="flex flex-col gap-3 text-gray-400 text-sm">
            <p>123 Agri Business Park<br />Gujarat, India 380001</p>
            <p className="mt-1">info@sardarbio.com</p>
            <p>+91 98765 43210</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-14 pt-8 border-t border-white/10 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Sardar Bio Organic. All rights reserved.</p>
        <Link href="/admin" className="hover:text-gray-300 transition-colors">Admin Portal</Link>
      </div>
    </footer>
  );
}
