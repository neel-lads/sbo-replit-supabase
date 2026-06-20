import { useState } from "react";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/animate";

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

      {/* Page header */}
      <div className="bg-gradient-to-br from-green-50 to-white border-b border-gray-100 py-20 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #00C62C 1px, transparent 0)", backgroundSize: "36px 36px" }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeUp>
            <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Our Range</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mt-3 mb-4">Our Solutions</h1>
            <p className="text-gray-500 max-w-xl text-lg">
              Premium organic compounds designed for maximum efficacy and minimal environmental impact.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 w-full flex-1">
        {/* Filters */}
        <FadeUp className="flex flex-col md:flex-row justify-between mb-12 gap-6">
          <div className="flex gap-3 flex-wrap">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              data-testid="select-category"
              className="bg-white border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#00C62C] focus:ring-2 focus:ring-[#00C62C]/20 transition-all text-gray-700"
            >
              <option value="">All Categories</option>
              <option value="bio-pesticide">Bio Pesticides</option>
              <option value="insecticide">Insecticides</option>
              <option value="fungicide">Fungicides</option>
            </select>

            <select
              value={form}
              onChange={(e) => setForm(e.target.value)}
              data-testid="select-form"
              className="bg-white border border-gray-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#00C62C] focus:ring-2 focus:ring-[#00C62C]/20 transition-all text-gray-700"
            >
              <option value="">All Forms</option>
              <option value="liquid">Liquid</option>
              <option value="powder">Powder</option>
              <option value="granules">Granules</option>
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
                    <div className="aspect-square bg-gray-50 overflow-hidden relative rounded-t-2xl">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm bg-gradient-to-br from-gray-50 to-gray-100">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        <span className="bg-white text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold rounded-full border border-gray-100 shadow-sm text-gray-700">
                          {product.category.replace("-", " ")}
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
