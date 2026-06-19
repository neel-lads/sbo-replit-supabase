import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id || "0", 10);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading, isError } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) }
  });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24 flex-1 animate-pulse flex gap-12">
        <div className="w-1/2 bg-gray-100 aspect-square"></div>
        <div className="w-1/2 flex flex-col gap-4">
          <div className="h-12 bg-gray-100 w-3/4"></div>
          <div className="h-6 bg-gray-100 w-1/4"></div>
          <div className="h-32 bg-gray-100 w-full mt-8"></div>
        </div>
      </div>
    </div>
  );

  if (isError || !product) return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-32 flex-1 text-center">
        <h1 className="text-3xl font-serif mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The solution you're looking for doesn't exist.</p>
        <Link href="/products" className="text-primary font-bold uppercase tracking-widest">Back to Products</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex text-xs font-medium uppercase tracking-widest text-gray-400">
          <Link href="/products" className="hover:text-gray-900 transition-colors">Products</Link>
          <span className="mx-3">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          
          {/* Images Gallery */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 aspect-square border border-gray-100 p-8 flex items-center justify-center relative">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              ) : (
                <div className="text-gray-300">No Image Available</div>
              )}
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-white text-xs px-3 py-1.5 uppercase tracking-widest font-bold border border-gray-200">{product.category.replace("-", " ")}</span>
                <span className="bg-gray-900 text-white text-xs px-3 py-1.5 uppercase tracking-widest font-bold">{product.form}</span>
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 bg-gray-50 border ${activeImage === idx ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-400'} transition-all p-2 flex-shrink-0`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">{product.description}</p>

            <div className="space-y-12">
              {product.content && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 pb-2 border-b border-gray-100">Technical Content</h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{product.content}</div>
                </div>
              )}

              {product.benefits && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 pb-2 border-b border-gray-100">Key Benefits</h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{product.benefits}</div>
                </div>
              )}

              {product.application_method && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 pb-2 border-b border-gray-100">Application Method</h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{product.application_method}</div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {product.available_packaging && (
                  <div className="bg-gray-50 p-6 border border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Available Packaging</h3>
                    <div className="text-gray-900 font-medium">{product.available_packaging}</div>
                  </div>
                )}
                {product.things_to_know && (
                  <div className="bg-primary/10 p-6 border border-primary/20">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Things to Know</h3>
                    <div className="text-gray-900 font-medium">{product.things_to_know}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-16">
              <Link href="/contact" className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
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
