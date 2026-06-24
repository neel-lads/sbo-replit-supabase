import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/animate";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Products() {
  const [categories, setCategories] = useState<string[]>([]);
  const [forms, setForms] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [form, setForm] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const getImageUrl = (path: string) => {
    if (!path) return "";

    if (path.startsWith("http")) return path;

    return `https://pfdwgxzhdqtvedwiovtn.supabase.co/storage/v1/object/public/product-images/${path}`;
  };
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      let query = supabase.from("products").select("*").order("name", { ascending: true });

      if (category) query = query.eq("category", category);
      if (form) query = query.eq("form", form);

      const { data, error } = await query;

      if (data) {
        setProducts(data);

        const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
        const uniqueForms = [...new Set(data.map(p => p.form).filter(Boolean))];

        setCategories(uniqueCategories);
        setForms(uniqueForms);
      }

      setIsLoading(false);
    };

    fetchProducts();
  }, [category, form]);

  useEffect(() => {
    const fetchFilters = async () => {
      const { data } = await supabase.from("products").select("category, form");

      if (data) {
        const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
        const uniqueForms = [...new Set(data.map(p => p.form).filter(Boolean))];

        setCategories(uniqueCategories);
        setForms(uniqueForms);
      }
    };

    fetchFilters();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Page header */}
      <div className="py-20 overflow-hidden relative" style={{ background: "#D4FFDD" }}>
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #00C62C 1px, transparent 0)", backgroundSize: "36px 36px" }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeUp>
            <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Our Range</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mt-3 mb-4">Our Products</h1>
            <p className="text-gray-600 max-w-xl text-lg">
              Field-proven organic solutions designed to protect crops, enrich soil, and deliver consistent results across every stage of growth.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 w-full flex-1">
        {/* Filters */}
        <FadeUp className="flex flex-col md:flex-row justify-between mb-12 gap-6">
          <div className="flex gap-3 flex-wrap">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="...">
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select value={form} onChange={(e) => setForm(e.target.value)} className="...">
              <option value="">All Forms</option>
              {forms.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="text-gray-400 text-sm font-medium self-end">
            {products?.length || 0} Products
          </div>
        </FadeUp>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-[420px] bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <FadeUp className="text-center py-24 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="text-gray-400 mb-4">No products found matching your criteria.</div>
            <button
              onClick={() => { setCategory(""); setForm(""); }}
              className="text-[#00C62C] font-semibold text-sm hover:underline"
            >
              Clear Filters
            </button>
          </FadeUp>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <StaggerItem key={product.id}>
                <Link href={`/products/${product.id}`} className="group block h-full" data-testid={`card-product-${product.id}`}>
                  <div className="bg-white h-full rounded-2xl border border-gray-100 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/8 transition-all duration-300 overflow-hidden flex flex-col">
                    <div className="bg-gray-50 h-64 flex items-center justify-center overflow-hidden relative rounded-t-2xl">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm bg-gradient-to-br from-gray-50 to-gray-100">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        <span className="bg-white text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold rounded-full border border-gray-100 shadow-sm text-gray-700">
                          {product.category?.replace("-", " ") || "Category"}
                        </span>
                        <span className="bg-gray-900 text-white text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold rounded-full">
                          {product.form}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-serif font-bold mb-2 group-hover:text-[#00C62C] transition-colors leading-tight text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">{product.description}</p>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#00C62C] border-t border-gray-100 pt-3 mt-auto">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      <Footer />
    </div>
  );
}
