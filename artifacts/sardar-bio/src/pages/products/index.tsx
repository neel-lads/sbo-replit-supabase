import { useState } from "react";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Products() {
  const [category, setCategory] = useState<string>("");
  const [form, setForm] = useState<string>("");
  
  const { data: products, isLoading } = useListProducts(
    { category: category || undefined, form: form || undefined }, 
    { query: { queryKey: getListProductsQueryKey({ category: category || undefined, form: form || undefined }) } }
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Our Solutions</h1>
          <p className="text-gray-600 max-w-2xl text-lg">Premium organic compounds designed for maximum efficacy and minimal environmental impact.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="flex flex-col md:flex-row justify-between mb-12 gap-6">
          <div className="flex gap-4 flex-wrap">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-gray-200 text-sm px-4 py-2 uppercase tracking-wide focus:outline-none focus:border-primary"
            >
              <option value="">All Categories</option>
              <option value="bio-pesticide">Bio Pesticides</option>
              <option value="insecticide">Insecticides</option>
              <option value="fungicide">Fungicides</option>
            </select>

            <select 
              value={form} 
              onChange={(e) => setForm(e.target.value)}
              className="bg-white border border-gray-200 text-sm px-4 py-2 uppercase tracking-wide focus:outline-none focus:border-primary"
            >
              <option value="">All Forms</option>
              <option value="liquid">Liquid</option>
              <option value="powder">Powder</option>
              <option value="granules">Granules</option>
            </select>
          </div>
          
          <div className="text-gray-500 text-sm font-medium uppercase tracking-widest self-end">
            {products?.length || 0} Products
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-[400px] bg-gray-100 animate-pulse"></div>)}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-24 border border-gray-100 bg-gray-50">
            <div className="text-gray-400 mb-4">No products found matching your criteria.</div>
            <button onClick={() => { setCategory(""); setForm(""); }} className="text-primary font-semibold uppercase tracking-wider text-sm">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products?.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group block h-full">
                <div className="bg-white p-5 h-full border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col">
                  <div className="aspect-square bg-gray-50 mb-5 overflow-hidden relative">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                      <span className="bg-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold border border-gray-100">{product.category.replace("-", " ")}</span>
                      <span className="bg-gray-900 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold">{product.form}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{product.description}</p>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary mt-auto">View Details</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
