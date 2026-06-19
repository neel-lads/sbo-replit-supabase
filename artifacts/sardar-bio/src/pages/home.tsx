import { useGetContent, useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: aboutUs } = useGetContent("about_us");
  const { data: foundersNote } = useGetContent("founders_note");
  const { data: featuredProducts, isLoading } = useListProducts({ featured: true }, {
    query: { queryKey: getListProductsQueryKey({ featured: true }) }
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-4 text-center z-10">
          <span className="inline-block py-1 px-3 border border-primary text-primary text-xs uppercase tracking-widest font-semibold mb-6">Est. 2004</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 max-w-4xl mx-auto leading-tight mb-6">
            Nurturing nature with <span className="text-primary italic">quiet authority</span>.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Premium wholesalers of bio pesticides, insecticides, and fungicides. Equipping farmers with superior organic solutions for over two decades.
          </p>
          <Button size="lg" className="bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-wider text-sm px-8 h-14" asChild>
            <Link href="/products">View Products</Link>
          </Button>
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-8">Rooted in Experience</h2>
            <div className="prose prose-lg text-gray-600 mx-auto">
              {aboutUs?.value ? (
                <p>{aboutUs.value}</p>
              ) : (
                <p>Founded by Amitbhai Ladani and Hasubhai Patel, Sardar Bio Organic has stood as a pillar of reliability in the agricultural wholesale sector since 2004. We specialize in high-efficacy organic farming solutions.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold">Featured Solutions</h2>
              <p className="text-gray-600 mt-2">Our most trusted organic compounds.</p>
            </div>
            <Link href="/products" className="text-sm font-semibold uppercase tracking-wider text-black border-b border-black pb-1 hover:text-primary hover:border-primary transition-all">
              See All
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-200 animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group block group">
                  <div className="bg-white p-6 h-full border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <div className="aspect-square bg-gray-50 mb-6 overflow-hidden relative">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white text-xs px-2 py-1 uppercase tracking-wider font-semibold border border-gray-100">{product.category}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Founders Note */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <svg className="w-12 h-12 mx-auto mb-8 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
          <div className="text-2xl md:text-3xl font-serif leading-relaxed mb-8 font-medium">
            {foundersNote?.value || "Our commitment has always been to the soil and those who tend it. Quality is not just a standard; it's our legacy."}
          </div>
          <div className="font-bold uppercase tracking-widest text-sm">Amitbhai Ladani & Hasubhai Patel</div>
          <div className="text-sm mt-1 opacity-70">Founders, Sardar Bio Organic</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
