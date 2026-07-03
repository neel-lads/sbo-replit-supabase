import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Helmet } from "react-helmet-async";

const seoMap: Record<string, { title: string; description: string }> = {
  "58 Commando": {
    title: "58 Commando | Organic Agriculture Product | Sardar Bio Organic",
    description: "Discover 58 Commando by Sardar Bio Organic, a trusted organic agricultural solution developed to improve crop performance, soil health, and sustainable farming productivity."
  },

  "Arunoday": {
    title: "Arunoday | Organic Agriculture Product | Sardar Bio Organic",
    description: "Explore Arunoday by Sardar Bio Organic, formulated to support healthier crops, improved nutrient availability, and sustainable agricultural practices."
  },

  "Combi Pack": {
    title: "Combi Pack | Organic Agriculture Product | Sardar Bio Organic",
    description: "Combi Pack from Sardar Bio Organic provides an effective combination of organic agricultural solutions to improve crop growth and overall soil productivity."
  },

  "Guru": {
    title: "Guru | Organic Agriculture Product | Sardar Bio Organic",
    description: "Guru by Sardar Bio Organic helps farmers enhance crop health and maintain sustainable agricultural productivity with trusted organic technology."
  },

  "Ketu": {
    title: "Ketu | Organic Agriculture Product | Sardar Bio Organic",
    description: "Ketu is a premium organic agricultural solution from Sardar Bio Organic designed to promote healthier crops and long-term soil vitality."
  },

  "Live": {
    title: "Live | Organic Agriculture Product | Sardar Bio Organic",
    description: "Live by Sardar Bio Organic supports sustainable farming through improved plant growth, nutrient efficiency, and healthier crop development."
  },

  "Maahir": {
    title: "Maahir | Organic Agriculture Product | Sardar Bio Organic",
    description: "Maahir is an advanced organic farming solution from Sardar Bio Organic developed to improve crop performance and agricultural productivity."
  },

  "Neemguru (10000 PPM)": {
    title: "Neemguru 10000 PPM | Neem-Based Bio Pesticide | Sardar Bio Organic",
    description: "Neemguru 10000 PPM is a premium neem-based bio pesticide from Sardar Bio Organic that helps protect crops while supporting eco-friendly farming."
  },

  "Neemguru (1500 PPM)": {
    title: "Neemguru 1500 PPM | Neem-Based Bio Pesticide | Sardar Bio Organic",
    description: "Neemguru 1500 PPM offers reliable neem-based crop protection for sustainable agriculture and healthier plant growth."
  },

  "Palak": {
    title: "Palak | Organic Agriculture Product | Sardar Bio Organic",
    description: "Palak by Sardar Bio Organic is designed to enhance crop vigor, soil fertility, and sustainable farming performance."
  },

  "Pasand": {
    title: "Pasand | Organic Agriculture Product | Sardar Bio Organic",
    description: "Pasand supports healthy crop development and improved agricultural productivity through organic farming practices."
  },

  "Pasand (Liquid)": {
    title: "Pasand Liquid | Organic Agriculture Product | Sardar Bio Organic",
    description: "Pasand Liquid is an easy-to-apply organic agricultural solution developed for healthier crops and efficient nutrient utilization."
  },

  "Prakruti Azoto": {
    title: "Prakruti Azoto | Bio Fertilizer | Sardar Bio Organic",
    description: "Prakruti Azoto is a bio fertilizer that enhances nitrogen availability, improves soil fertility, and supports sustainable crop production."
  },

  "Prakruti Bio NPK (Liquid)": {
    title: "Prakruti Bio NPK Liquid | Bio Fertilizer | Sardar Bio Organic",
    description: "Prakruti Bio NPK Liquid supplies essential nutrients naturally, promoting vigorous crop growth and healthier soil ecosystems."
  },

  "Prakruti Bio-NPK": {
    title: "Prakruti Bio-NPK | Bio Fertilizer | Sardar Bio Organic",
    description: "Prakruti Bio-NPK is an organic bio fertilizer that improves nutrient uptake, soil health, and crop productivity."
  },

  "Prakruti Mycorrhiza (1200 IP)": {
    title: "Prakruti Mycorrhiza 1200 IP | Bio Fertilizer | Sardar Bio Organic",
    description: "Prakruti Mycorrhiza 1200 IP enhances root development, nutrient absorption, and plant resilience for sustainable agriculture."
  },

  "Prakruti Mycorrhiza (300000 IP)": {
    title: "Prakruti Mycorrhiza 300000 IP | Bio Fertilizer | Sardar Bio Organic",
    description: "Prakruti Mycorrhiza 300000 IP delivers high-potency mycorrhizal support for stronger roots, improved nutrient uptake, and healthier crops."
  },

  "Prakruti Phospho": {
    title: "Prakruti Phospho | Bio Fertilizer | Sardar Bio Organic",
    description: "Prakruti Phospho increases phosphorus availability naturally, encouraging stronger root systems and improved crop growth."
  },

  "Prakruti Potash": {
    title: "Prakruti Potash | Bio Fertilizer | Sardar Bio Organic",
    description: "Prakruti Potash helps improve potassium availability, crop quality, stress tolerance, and overall agricultural productivity."
  },

  "Prakruti PROM": {
    title: "Prakruti PROM | Organic Phosphate Rich Manure | Sardar Bio Organic",
    description: "Prakruti PROM is an organic phosphate rich manure that improves soil fertility, phosphorus availability, and sustainable crop nutrition."
  },

  "Prakruti Zinc": {
    title: "Prakruti Zinc | Organic Zinc Fertilizer | Sardar Bio Organic",
    description: "Prakruti Zinc helps correct zinc deficiency, supports healthy plant growth, and improves crop yield through balanced nutrition."
  },

  "Prakruti Zinc (Liquid)": {
    title: "Prakruti Zinc Liquid | Organic Zinc Fertilizer | Sardar Bio Organic",
    description: "Prakruti Zinc Liquid provides efficient zinc nutrition for stronger crops, healthier foliage, and better agricultural productivity."
  },

  "Trichoguru": {
    title: "Trichoguru | Bio Fungicide | Sardar Bio Organic",
    description: "Trichoguru is a bio fungicide that supports natural disease management, healthier roots, and sustainable crop protection."
  },

  "Trichoguru (Liquid)": {
    title: "Trichoguru Liquid | Bio Fungicide | Sardar Bio Organic",
    description: "Trichoguru Liquid offers convenient biological disease protection while promoting healthier crops and sustainable farming."
  },

  "Vian": {
    title: "Vian | Organic Agriculture Product | Sardar Bio Organic",
    description: "Vian is an advanced organic agricultural solution designed to support healthy plant growth, improved crop performance, and sustainable farming."
  },

  "VM": {
    title: "VM | Organic Agriculture Product | Sardar Bio Organic",
    description: "VM by Sardar Bio Organic combines advanced organic technologies to improve crop health, nutrient efficiency, and overall farm productivity."
  },

  "Winner": {
    title: "Winner | Organic Agriculture Product | Sardar Bio Organic",
    description: "Winner is a trusted organic agricultural product that supports healthy crops, sustainable farming, and improved agricultural performance."
  },

  "Winner (Liquid)": {
    title: "Winner Liquid | Organic Agriculture Product | Sardar Bio Organic",
    description: "Winner Liquid delivers reliable organic crop support through an easy-to-apply formulation that promotes healthy plant growth and productivity."
  }
};


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
        setProduct(data); console.log(data);
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

  const seo = seoMap[product.name] ?? {
    title: `${product.name} | Sardar Bio Organic`,
    description:
      product.description ||
      `${product.name} by Sardar Bio Organic.`,
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>

        <meta
          name="description"
          content={seo.description}
        />
      </Helmet>

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
            <div className="text-gray-600 whitespace-pre-line leading-relaxed mb-12">{product.description}</div>

            <div className="space-y-10">
              {product.content && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#00C62C] mb-4 pb-2 border-b border-gray-100">Technical Content</h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{product.content}</div>
                </div>
              )}

              {product.benefits && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#00C62C] mb-4 pb-2 border-b border-gray-100">Key Benefits</h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{product.benefits}</div>
                </div>
              )}

              {product.application_method && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#00C62C] mb-4 pb-2 border-b border-gray-100">Application Method</h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">{product.application_method}</div>
                </div>
              )}

              {product.notes && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#00C62C] mb-4 pb-2 border-b border-gray-100">
                    Notes
                  </h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {product.notes}
                  </div>
                </div>
              )}

              {product.packaging && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#00C62C] mb-4 pb-2 border-b border-gray-100">
                    Available Packaging
                  </h3>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {product.packaging}
                  </div>
                </div>
              )}
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
  </>
  );
}
