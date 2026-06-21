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

  const { data: featuredProducts, isLoading } = useListProducts(
    { featured: true },
    { query: { queryKey: getListProductsQueryKey({ featured: true }) } }
  );

  // ✅ Supabase Test (CORRECT placement)
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
          <img src={heroFarm} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="text-center z-10">
          <h1 className="text-5xl text-white font-bold">
            Sardar Bio Organic
          </h1>
          <p className="text-white/70 mt-4">
            Organic farming solutions since 2004
          </p>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Featured Products
        </h2>

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts?.map((product) => (
              <div
                key={product.id}
                className="border p-5 rounded-xl shadow-sm"
              >
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {product.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}