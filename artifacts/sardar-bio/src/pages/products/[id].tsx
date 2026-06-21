import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id || "0", 10);
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setIsError(false);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        setIsError(true);
      } else {
        setProduct(data);
      }

      setIsLoading(false);
    };

    if (productId > 0) {
      fetchProduct();
    }
  }, [productId]);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-24 w-full flex-1 animate-pulse flex gap-12">
        <div className="w-1/2 bg-gray-100 aspect-square rounded-2xl" />
        <div className="w-1/2 flex flex-col gap-4">
          <div className="h-12 bg-gray-100 rounded-xl w-3/4" />
          <div className="h-6 bg-gray-100 rounded-xl w-1/4" />
          <div className="h-32 bg-gray-100 rounded-xl w-full mt-8" />
        </div>
      </div>
    </div>
  );

  if (isError || !product) return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-32 w-full flex-1 text-center">
        <h1 className="text-3xl font-serif mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The solution you're looking for doesn't exist.</p>
        <Link href="/products" className="text-[#00C62C] font-bold uppercase tracking-widest">Back to Products</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Back + Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4 text-xs font-medium text-gray-400">
          <Link
            href="/products"
            data-testid="link-back-products"
            className="flex items-center gap-2 text-gray-500 hover:text-[#00C62C] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="uppercase tracking-widest font-semibold">All Products</span>
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">

          {/* Images Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 aspect-square rounded-2xl border border-gray-100 p-8 flex items-center justify-center relative overflow-hidden">
              
              {product?.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name || "Product"}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="text-gray-300">No Image Available</div>
              )}

              <div className="absolute top-5 left-5 flex gap-2">
                <span className="bg-white text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold rounded-full border border-gray-200 shadow-sm text-gray-700">
                  {product?.category?.replace("-", " ") || "Category"}
                </span>

                <span className="bg-gray-900 text-white text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold rounded-full">
                  {product?.form || "FORM"}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-5">{product.name}</h1>
            <p className="text-lg text-gray-500 mb-12 leading-relaxed">{product.description}</p>

            <div className="space-y-10">
              {product.content && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">Technical Content</h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{product.content}</div>
                </div>
              )}

              {product.benefits && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">Key Benefits</h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{product.benefits}</div>
                </div>
              )}

              {product.application_method && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">Application Method</h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{product.application_method}</div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.packaging && (
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Available Packaging</h3>
                    <div className="text-gray-900 font-medium">{product.packaging}</div>
                  </div>
                )}
                {product.notes && (
                  <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#00C62C] mb-2">Notes</h3>
                    <div className="text-gray-700 font-medium">{product.notes}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-14">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity shadow-md shadow-green-200"
              >
                Enquire About Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
