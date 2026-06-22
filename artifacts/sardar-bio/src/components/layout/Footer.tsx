import { Link } from "wouter";
import logo from "@/assets/SARADAR BIO LOGO.svg";

export function Footer() {
  return (
    <footer className="pt-16 pb-8 mt-24" style={{ background: "#D4FFDD" }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="inline-block mb-4">
            <img src={logo} alt="Sardar Bio Organic" className="h-10 md:h-12 w-auto object-contain"/>
          </Link>
          <div className="w-10 h-1 rounded-full bg-[#00C62C]/40 mt-3 mb-4" />
          <p className="text-gray-600 max-w-sm leading-relaxed">
            Premium organic farming wholesale company operating since 2004. Quality bio pesticides, insecticides, and fungicides for professional agriculture.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-6 text-gray-800">Explore</h4>
          <div className="flex flex-col gap-3 text-gray-500">
            <Link href="/" className="hover:text-[#00C62C] transition-colors w-fit text-sm">Home</Link>
            <Link href="/products" className="hover:text-[#00C62C] transition-colors w-fit text-sm">Products</Link>
            <Link href="/dealers" className="hover:text-[#00C62C] transition-colors w-fit text-sm">Find a Dealer</Link>
            <Link href="/contact" className="hover:text-[#00C62C] transition-colors w-fit text-sm">Contact Us</Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-6 text-gray-800">Contact</h4>
          <div className="flex flex-col gap-3 text-gray-500 text-sm">
            <p>Survey No. 4, Plot No. 28-29, Lalpari Talav Rd, Ambavadi, Navagam (Anandpar), Rajkot, Gujarat, India. - 360003</p>
            <p className="mt-1">sardar2004.rjt@gmail.com</p>
            <p>+91 98257 35427<br />+91 99090 26600</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-14 pt-8 border-t border-black/10 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Sardar Bio Organic. All rights reserved.</p>
        <Link href="/admin" className="hover:text-gray-700 transition-colors">Admin Portal</Link>
      </div>
    </footer>
  );
}
