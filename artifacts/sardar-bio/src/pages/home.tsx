import { useGetContent, useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { FadeUp, FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animate";
import { motion } from "framer-motion";
import heroFarm from "@/assets/hero-farm.png";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { data: aboutUs } = useGetContent("about_us");
  const { data: foundersNote } = useGetContent("founders_note");
  const { data: featuredProducts, isLoading } = useListProducts({ featured: true }, {
    query: { queryKey: getListProductsQueryKey({ featured: true }) }
  })
    useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from("products").select("*");

      console.log("SUPABASE DATA:", data);
      console.log("SUPABASE ERROR:", error);
    };

    test();
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
            Est. 2004
          </motion.span>

          <motion.h1
            className="text-5xl md:text-7xl font-serif font-bold text-white max-w-4xl mx-auto leading-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            Nurturing nature with{" "}
            <span className="text-[#00C62C] italic">quiet authority</span>.
          </motion.h1>

          <motion.p
            className="text-lg text-white/75 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Premium wholesalers of bio pesticides, insecticides, and fungicides.
            Equipping farmers with superior organic solutions for over two decades.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white hover:opacity-90 rounded-full uppercase tracking-wider text-sm px-10 h-13 font-semibold shadow-lg shadow-green-900/30 border-0"
              asChild
            >
              <Link href="/products">View Products</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/60 text-white bg-white/10 hover:bg-white hover:text-black rounded-full uppercase tracking-wider text-sm px-10 h-13 shadow-none backdrop-blur-sm"
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <FadeUp>
                <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">About Us</span>
                <h2 className="text-4xl font-serif font-bold mt-3 mb-6 leading-tight text-gray-900">
                  Rooted in over two decades of experience
                </h2>
              </FadeUp>
              <FadeUp delay={0.15}>
                <div className="text-gray-500 leading-relaxed space-y-4">
                  {aboutUs?.value ? (
                    aboutUs.value.split("\n\n").slice(0, 2).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    <p>Founded by Amitbhai Ladani and Hasubhai Patel, Sardar Bio Organic has stood as a pillar of reliability in the agricultural wholesale sector since 2004.</p>
                  )}
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
                { name: "Amitbhai Ladani", role: "Co-Founder" },
                { name: "Hasubhai Patel", role: "Co-Founder" },
              ].map((founder) => (
                <StaggerItem key={founder.name}>
                  <div className="border border-gray-100 rounded-2xl p-6 flex items-center gap-5 hover:border-[#00C62C]/30 hover:bg-green-50/50 hover:shadow-sm transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C62C] to-[#00a325] flex items-center justify-center flex-shrink-0 text-white font-bold text-lg font-serif shadow-sm">
                      {founder.name[0]}
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
                  <div className="text-sm text-gray-400 mt-1">Wholesale &amp; Stockist, Gujarat</div>
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
              <h2 className="text-4xl font-serif font-bold mt-3 text-gray-900">Featured Solutions</h2>
              <p className="text-gray-500 mt-2">Our most trusted organic compounds.</p>
            </FadeUp>
            <FadeIn delay={0.2}>
              <Link href="/products" className="text-sm font-semibold text-[#00C62C] hover:underline transition-all">
                See All →
              </Link>
            </FadeIn>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <StaggerItem key={product.id}>
                  <Link href={`/products/${product.id}`} className="group block h-full">
                    <div className="bg-white h-full rounded-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/8 overflow-hidden">
                      <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative rounded-t-2xl">
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
                        <div className="absolute top-4 left-4">
                          <span className="bg-white text-[10px] px-3 py-1 uppercase tracking-widest font-bold rounded-full border border-gray-100 shadow-sm">
                            {product.category.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl font-serif font-bold group-hover:text-[#00C62C] transition-colors leading-tight text-gray-900">
                            {product.name}
                          </h3>
                          <span className="bg-gray-900 text-white text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold flex-shrink-0 rounded-full">
                            {product.form}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
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
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Why Sardar Bio</span>
            <h2 className="text-3xl font-serif font-bold mt-3 text-gray-900">Trusted Across the Supply Chain</h2>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Verified Quality", body: "Every product meets stringent organic farming standards tested for efficacy and environmental safety." },
              { title: "Wide Distribution", body: "Authorized dealers across Gujarat and neighboring states ensure timely and consistent supply." },
              { title: "Expert Support", body: "Two decades of domain expertise backing every product recommendation and dealer partnership." },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="bg-gray-50 rounded-2xl p-8 h-full hover:bg-green-50 hover:border-[#00C62C]/20 border border-transparent transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C62C] to-[#00a325] flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                    <div className="w-4 h-0.5 bg-white rounded-full" />
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
            {foundersNote?.value
              ? foundersNote.value.split("\n\n")[0]
              : "Our commitment has always been to the soil and those who tend it. Quality is not just a standard — it is our legacy."}
          </blockquote>
          <div className="flex items-center justify-center gap-3 mx-auto mb-6 w-fit">
            <div className="w-10 h-px bg-gray-300" />
            <div className="w-16 h-0.5 rounded-full bg-[#00C62C]" />
            <div className="w-10 h-px bg-gray-300" />
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
              size="lg"
              className="bg-white text-[#00C62C] hover:bg-gray-50 rounded-full uppercase tracking-wider text-sm px-10 h-13 shadow-none flex-shrink-0 font-bold border-0"
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
