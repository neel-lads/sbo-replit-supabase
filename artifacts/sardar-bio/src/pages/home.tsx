import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { FadeUp, FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animate";
import { motion } from "framer-motion";
import heroFarm from "@/assets/hero-farm.png";
import { supabase } from "@/lib/supabase";

type product = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  form?: string;
  image_url?: string;
};
export default function Home() {
  const [products, setProducts] = useState<product[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);
  const visibleProducts = [
    products[index],
    products[(index + 1) % products.length],
    products[(index + 2) % products.length],
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === visibleProducts.length - 1 ? 0 : prev + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, visibleProducts.length]);

  const getImageUrl = (path: string) => {
    if (!path) return "";

    if (path.startsWith("http")) return path;

    return `https://pfdwgxzhdqtvedwiovtn.supabase.co/storage/v1/object/public/product-images/${path}`;
  };
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("products").select("*").eq("featured", true);

      console.log("SUPABASE DATA:", data);
      console.log("SUPABASE ERROR:", error);

      if (data) setProducts(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroFarm}
            alt="Gujarat groundnut farm"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/75" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center z-10 relative">
          <motion.span
            className="inline-block py-1.5 px-5 rounded-full border border-[#00C62C] text-[#00C62C] text-xs uppercase tracking-widest font-semibold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Since 2004
          </motion.span>

          <motion.h1
            className="text-5xl md:text-7xl font-serif font-bold text-white max-w-4xl mx-auto leading-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            The Future of{" "}
            <span className="text-[#00C62C] italic">Organic Farming</span>
          </motion.h1>

          <motion.p
            className="text-lg text-white/75 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Empowering agriculture with trusted organic solutions, 
            built on decades of field-proven expertise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              className="px-6 py-3 bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white hover:opacity-90 rounded-full uppercase tracking-wider text-sm px-10 h-13 font-semibold shadow-lg shadow-green-900/30 border-0"
              asChild
            >
              <Link href="/products">View Products</Link>
            </Button>
            <Button
              className="px-6 py-3 border-white/60 text-white bg-white/10 hover:bg-white hover:text-black rounded-full uppercase tracking-wider text-sm px-10 h-13 shadow-none backdrop-blur-sm"
              asChild
            >
              <Link href="/dealers">Find a Dealer</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="text-white/40 text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-px h-12 bg-white/25 origin-top"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ── Stats strip ── */}
      <FadeIn className="bg-gradient-to-r from-[#00C62C] to-[#00a325]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 divide-x divide-white/20">
            {[
              { value: "20+", label: "Years of Experience" },
              { value: "500+", label: "Dealers & Distributors" },
              { value: "3", label: "Product Categories" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4 py-2">
                <div className="text-2xl md:text-3xl font-serif font-bold text-white">{stat.value}</div>
                <div className="text-[11px] uppercase tracking-widest text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── About ── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <FadeUp>
                <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">About Us</span>
                <h2 className="text-4xl font-serif font-bold mt-3 mb-6 leading-tight text-gray-900">
                  Over two decades of understanding what truly matters in agriculture.
                </h2>
              </FadeUp>
              <FadeUp delay={0.15}>
                <div className="text-gray-500 leading-relaxed space-y-4">
                  <p>
                    Founded by Amitbhai Ladani and Hasubhai Patel, Sardar Bio Organic has been a trusted name in organic agricultural solutions since 2004. With a deep understanding of farming practices and evolving crop needs, the company has consistently delivered reliable, high-quality bio products that support sustainable growth.

                    Over the years, we have built strong relationships with farmers, dealers, and distributors by focusing on effectiveness, consistency, and long-term value. Our product range is designed to improve crop health while maintaining ecological balance.

                    Driven by experience and grounded in practical field knowledge, Sardar Bio Organic continues to empower modern agriculture with solutions that are both efficient and environmentally responsible.
                  </p>
                </div>
              </FadeUp>
              <FadeUp delay={0.25}>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-[#00C62C] hover:gap-3 transition-all"
                >
                  Explore Our Products
                  <span>→</span>
                </Link>
              </FadeUp>
            </div>

            <StaggerContainer className="flex flex-col gap-4">
              {[
                { name: "Amitbhai Ladani", role: "Co-Founder", image: "/./amitbhai.jpg" },
                { name: "Hasubhai Patel", role: "Co-Founder", image: "/./hasubhai.jpg" },
              ].map((founder) => (
                <StaggerItem key={founder.name}>
                  <div className="border border-gray-100 rounded-2xl p-6 flex items-center gap-5 hover:border-[#00C62C]/30 hover:bg-green-50/50 hover:shadow-sm transition-all duration-300">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00C62C] shadow-sm flex-shrink-0">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-gray-900">{founder.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{founder.role} · Sardar Bio Organic</div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
              <StaggerItem>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Operating Since</div>
                  <div className="text-4xl font-serif font-bold text-gray-900">2004</div>
                  <div className="text-sm text-gray-400 mt-1">Supporting farmers and partners across Gujarat and beyond</div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-14">
            <FadeUp>
              <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">What We Offer</span>
              <h2 className="text-4xl font-serif font-bold mt-3 text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-2">Our most trusted organic solutions.</p>
            </FadeUp>
            <FadeIn delay={0.2}>
              <Link href="/products" className="text-sm font-semibold text-[#00C62C] hover:underline transition-all">
                See All →
              </Link>
            </FadeIn>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (

            <>
              {/* 🔥 MOBILE SLIDER */}
              <div
                className="overflow-hidden md:hidden"
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out will-change-transform"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <Link href={`/products/${product.id}`} className="group block h-full">
                        <div className="bg-white h-full rounded-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/8 overflow-hidden">

                          <div className="aspect-[4/3] bg-gray-50 relative rounded-t-2xl flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-contain p-4"
                              />
                            ) : (
                              <div className="text-gray-300 text-sm">
                                No Image
                              </div>
                            )}

                            <div className="absolute top-4 left-4">
                              <span className="bg-white text-[10px] px-3 py-1 uppercase tracking-widest font-bold rounded-full border border-gray-100 shadow-sm">
                                {product.category ? product.category.replace("-", " ") : "Category"}
                              </span>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <h3 className="text-xl font-serif font-bold group-hover:text-[#00C62C] transition-colors leading-tight text-gray-900">
                                {product.name}
                              </h3>
                              <span className="bg-gray-900 text-white text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold flex-shrink-0 rounded-full">
                                {product.form || "FORM"}
                              </span>
                            </div>

                            <p className="text-gray-400 text-sm line-clamp-2">
                              {product.description || "No description available"}
                            </p>

                            <div className="flex items-center gap-1 mt-5 text-xs font-bold uppercase tracking-widest text-[#00C62C]">
                              <span>View Details</span>
                              <motion.span
                                className="inline-block"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              >
                                →
                              </motion.span>
                            </div>
                          </div>

                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🔥 DESKTOP GRID */}
              <div className="hidden md:grid md:grid-cols-3 gap-8">
                {visibleProducts.map((product) => (
                  <div key={product.id}>
                    <Link href={`/products/${product.id}`} className="group block h-full">
                      <div className="bg-white h-full rounded-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/8 overflow-hidden">

                        <div className="aspect-[4/3] bg-gray-50 relative rounded-t-2xl flex items-center justify-center overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-contain p-4"
                            />
                          ) : (
                            <div className="text-gray-300 text-sm">
                              No Image
                            </div>
                          )}

                          <div className="absolute top-4 left-4">
                            <span className="bg-white text-[10px] px-3 py-1 uppercase tracking-widest font-bold rounded-full border border-gray-100 shadow-sm">
                              {product.category ? product.category.replace("-", " ") : "Category"}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-xl font-serif font-bold group-hover:text-[#00C62C] transition-colors leading-tight text-gray-900">
                              {product.name}
                            </h3>
                            <span className="bg-gray-900 text-white text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold flex-shrink-0 rounded-full">
                              {product.form || "FORM"}
                            </span>
                          </div>

                          <p className="text-gray-400 text-sm line-clamp-2">
                            {product.description || "No description available"}
                          </p>

                          <div className="flex items-center gap-1 mt-5 text-xs font-bold uppercase tracking-widest text-[#00C62C]">
                            <span>View Details</span>
                            <motion.span
                              className="inline-block"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                              →
                            </motion.span>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Why Sardar Bio</span>
            <h2 className="text-3xl font-serif font-bold mt-3 text-gray-900">Built for the Field. Trusted Beyond It.</h2>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Field-Proven Solutions",
                body: "Every product is shaped by real agricultural challenges and tested in actual farming conditions, ensuring reliable performance where it truly matters.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 21c-4-4-6-7-6-10a6 6 0 1112 0c0 3-2 6-6 10z" />
                  </svg>
                ),
              },
              {
                title: "Strong Regional Presence",
                body: "With a well-established network across Gujarat and beyond, we ensure accessibility, consistency, and dependable partnerships across the agricultural ecosystem.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                ),
              },
              {
                title: "Backed by Experience",
                body: "With over two decades in the industry, our expertise translates into products and recommendations that are practical, effective, and trusted over time.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                ),
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="bg-gray-50 rounded-2xl p-8 h-full hover:bg-green-50 hover:border-[#00C62C]/20 border border-transparent transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C62C] to-[#00a325] flex items-center justify-center mb-5 shadow-sm text-white group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Founders Note ── */}
      <section className="py-28 overflow-hidden relative" style={{ background: "#D4FFDD" }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #00C62C 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <FadeUp className="max-w-7xl mx-auto px-6 max-w-4xl text-center relative z-10">
          <div className="w-12 h-12 rounded-full bg-[#00C62C]/25 border border-[#00C62C]/50 flex items-center justify-center mx-auto mb-8">
            <svg className="w-6 h-6 text-[#00C62C]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed mb-10 font-medium text-gray-800">
            "Behind every product is a deeper commitment to the land, to the farmer, and to the future of agriculture."
          </blockquote>
          <div className="flex items-center justify-center gap-3 mx-auto mb-6 w-fit">
            <div className="w-16 h-0.5 rounded-full bg-[#00C62C]" />
          </div>
          <div className="font-bold uppercase tracking-widest text-sm text-gray-900">Amitbhai Ladani &amp; Hasubhai Patel</div>
          <div className="text-sm mt-2 text-gray-500 uppercase tracking-wider">Founders, Sardar Bio Organic</div>
        </FadeUp>
      </section>

      {/* ── CTA ── */}
      <ScaleIn>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-[#00C62C] to-[#00a325] rounded-3xl px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-green-200">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Looking for a distribution partner?</h2>
              <p className="text-white/70 mt-1 text-sm">Enquire about dealership opportunities across Gujarat and beyond.</p>
            </div>
            <Button
              className="px-6 py-3 bg-white text-[#00C62C] hover:bg-gray-50 rounded-full uppercase tracking-wider text-sm px-10 h-13 shadow-none flex-shrink-0 font-bold border-0"
              asChild
            >
              <Link href="/contact">Become a Dealer</Link>
            </Button>
          </div>
        </div>
      </ScaleIn>

      <Footer />
    </div>
  );
}
