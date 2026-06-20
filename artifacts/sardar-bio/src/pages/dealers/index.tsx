import { useState } from "react";
import {
  useLocateDealers,
  useGetContent,
  getLocateDealersQueryKey,
} from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Phone, Mail, Search, ExternalLink, Building2, X } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/animate";

type AnyDealer = {
  id: number;
  firm_name: string;
  contact: string;
  address: string;
  email?: string | null;
  pincode: string;
  lat: number;
  lng: number;
  map_link?: string | null;
  distance_km?: number;
  created_at: string;
};

export default function Dealers() {
  const [pincode, setPincode] = useState("");
  const [searchPincode, setSearchPincode] = useState<string | null>(null);
  const [selectedDealer, setSelectedDealer] = useState<AnyDealer | null>(null);

  const { data: introText } = useGetContent("dealers_intro");

  const { data: nearbyDealers, isLoading: searchLoading, isError } = useLocateDealers(
    { pincode: searchPincode || "" },
    { query: { enabled: !!searchPincode, queryKey: getLocateDealersQueryKey({ pincode: searchPincode || "" }) } }
  );

  const top3 = nearbyDealers?.slice(0, 3) ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) setSearchPincode(pincode);
  };

  const clearSearch = () => {
    setSearchPincode(null);
    setPincode("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header + search */}
      <div
        className="py-24 overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #383084 0%, #009FE2 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }}
        />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">Our Network</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mt-3 mb-5">
              Find a Dealer
            </h1>
            <p className="text-white/75 text-base mb-10 leading-relaxed max-w-xl mx-auto">
              {introText?.value?.split("\n\n")[0] ||
                "Enter your pincode to find the 3 nearest authorised Sardar Bio Organic dealers in your area."}
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center relative">
              <div className="absolute left-4 text-gray-400 pointer-events-none">
                <Search className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                data-testid="input-pincode"
                className="h-14 pl-12 pr-36 text-base rounded-2xl border-0 bg-white shadow-xl focus-visible:ring-2 focus-visible:ring-white/50"
                required
              />
              <Button
                type="submit"
                disabled={pincode.length !== 6 || searchLoading}
                data-testid="button-locate"
                className="absolute right-1.5 top-1.5 bottom-1.5 h-auto rounded-xl text-white hover:opacity-90 uppercase tracking-widest text-xs font-bold px-6 border-0 shadow-none"
                style={{ background: "linear-gradient(135deg, #00C62C 0%, #004d11 100%)" }}
              >
                {searchLoading ? "Searching…" : "Locate"}
              </Button>
            </form>
          </FadeUp>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-20 w-full flex-1">
        {!searchPincode ? (
          <FadeUp className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
              <MapPin className="w-8 h-8 text-[#00C62C]" />
            </div>
            <p className="text-gray-500 text-lg">Enter your pincode above to find nearby dealers.</p>
            <p className="text-gray-400 text-sm mt-2">We'll show you the 3 closest authorised dealers.</p>
          </FadeUp>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Search Results</span>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                  {searchLoading
                    ? "Searching…"
                    : isError
                    ? "Search Error"
                    : `Nearest dealers to ${searchPincode}`}
                </h2>
              </div>
              <button
                onClick={clearSearch}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors font-medium"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            </div>

            {searchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-52 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100 text-red-500">
                Unable to find dealers for this pincode. Please try another.
              </div>
            ) : top3.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {top3.map((dealer) => (
                  <StaggerItem key={dealer.id}>
                    <DealerCard dealer={dealer} onClick={() => setSelectedDealer(dealer)} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 font-medium">No dealers found near <strong>{searchPincode}</strong>.</p>
                <p className="text-sm text-gray-400 mt-1">Try a nearby pincode or contact us directly.</p>
                <a
                  href="/contact"
                  className="inline-block mt-6 text-sm font-semibold text-[#00C62C] hover:underline"
                >
                  Contact Us →
                </a>
              </div>
            )}
          </section>
        )}
      </div>

      <Footer />

      {/* Dealer detail popup */}
      <Dialog open={!!selectedDealer} onOpenChange={(open) => !open && setSelectedDealer(null)}>
        <DialogContent className="max-w-md rounded-3xl p-0 gap-0 overflow-hidden border-0 shadow-2xl">
          {selectedDealer && (
            <>
              <div className="h-2 w-full" style={{ background: "linear-gradient(90deg, #00C62C 0%, #004d11 100%)" }} />
              <div className="p-8">
                <DialogHeader className="mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: "linear-gradient(135deg, #00C62C 0%, #004d11 100%)" }}>
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-serif font-bold leading-tight text-left text-gray-900">
                        {selectedDealer.firm_name}
                      </DialogTitle>
                      <p className="text-xs text-gray-400 mt-1">
                        Authorised Dealer · Sardar Bio Organic
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-4 items-start bg-gray-50 rounded-xl p-4">
                    <MapPin className="w-4 h-4 text-[#00C62C] shrink-0 mt-0.5" />
                    <div>
                      <p className="leading-relaxed">{selectedDealer.address}</p>
                      <p className="text-gray-400 mt-0.5 text-xs">Pincode: {selectedDealer.pincode}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center bg-gray-50 rounded-xl p-4">
                    <Phone className="w-4 h-4 text-[#00C62C] shrink-0" />
                    <a href={`tel:${selectedDealer.contact}`} className="hover:text-[#00C62C] font-medium transition-colors">
                      {selectedDealer.contact}
                    </a>
                  </div>

                  {selectedDealer.email && (
                    <div className="flex gap-4 items-center bg-gray-50 rounded-xl p-4">
                      <Mail className="w-4 h-4 text-[#00C62C] shrink-0" />
                      <a href={`mailto:${selectedDealer.email}`} className="hover:text-[#00C62C] transition-colors break-all">
                        {selectedDealer.email}
                      </a>
                    </div>
                  )}

                  {selectedDealer.distance_km !== undefined && (
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-2 rounded-xl text-xs font-semibold text-[#00C62C]">
                      <MapPin className="w-3.5 h-3.5" />
                      {(selectedDealer.distance_km as number).toFixed(1)} km from your pincode
                    </div>
                  )}
                </div>

                {selectedDealer.map_link && (
                  <a
                    href={selectedDealer.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 w-full text-white py-3.5 text-sm font-bold rounded-2xl hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #00C62C 0%, #004d11 100%)" }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Location on Map
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DealerCard({ dealer, onClick }: { dealer: AnyDealer; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-testid={`card-dealer-${dealer.id}`}
      className="w-full text-left p-6 rounded-2xl border border-gray-100 bg-white hover:border-[#00C62C]/30 hover:bg-green-50/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif font-bold text-gray-900 leading-tight group-hover:text-[#00C62C] transition-colors">
          {dealer.firm_name}
        </h3>
        {dealer.distance_km !== undefined && (
          <span className="text-white text-[10px] px-2.5 py-1 font-bold ml-3 shrink-0 rounded-full" style={{ background: "linear-gradient(135deg, #00C62C 0%, #004d11 100%)" }}>
            {dealer.distance_km.toFixed(1)} km
          </span>
        )}
      </div>
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex gap-2 items-start">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#00C62C]" />
          <span className="line-clamp-2">{dealer.address}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Phone className="w-4 h-4 shrink-0 text-[#00C62C]" />
          <span>{dealer.contact}</span>
        </div>
      </div>
      <div className="mt-4 text-[10px] uppercase tracking-widest font-bold text-[#00C62C]">
        View Details →
      </div>
    </button>
  );
}
