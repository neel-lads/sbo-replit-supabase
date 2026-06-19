import { useState } from "react";
import {
  useLocateDealers,
  useListDealers,
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
import { MapPin, Phone, Mail, Search, ExternalLink, Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
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

const PAGE_SIZE = 10;

export default function Dealers() {
  const [pincode, setPincode] = useState("");
  const [searchPincode, setSearchPincode] = useState<string | null>(null);
  const [selectedDealer, setSelectedDealer] = useState<AnyDealer | null>(null);
  const [page, setPage] = useState(1);

  const { data: introText } = useGetContent("dealers_intro");
  const { data: allDealers, isLoading: allLoading } = useListDealers();

  const { data: nearbyDealers, isLoading: searchLoading, isError } = useLocateDealers(
    { pincode: searchPincode || "" },
    { query: { enabled: !!searchPincode, queryKey: getLocateDealersQueryKey({ pincode: searchPincode || "" }) } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setSearchPincode(pincode);
    }
  };

  const clearSearch = () => {
    setSearchPincode(null);
    setPincode("");
  };

  // Pagination
  const totalPages = Math.ceil((allDealers?.length ?? 0) / PAGE_SIZE);
  const pagedDealers = allDealers?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header + search */}
      <div className="bg-[#b5ffc5]/20 py-20 border-b border-[#b5ffc5]/40">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <FadeUp>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Our Network</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-3 mb-6">
              Find a Dealer
            </h1>
            <p className="text-gray-600 text-base mb-10 leading-relaxed max-w-xl mx-auto">
              {introText?.value?.split("\n\n")[0] ||
                "Our trusted network of dealers ensures you have access to Sardar Bio Organic solutions wherever your farm is located."}
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
                className="h-14 pl-12 pr-36 text-base rounded-none border-gray-300 focus-visible:ring-primary shadow-sm"
                required
              />
              <Button
                type="submit"
                disabled={pincode.length !== 6 || searchLoading}
                data-testid="button-locate"
                className="absolute right-1 top-1 bottom-1 h-auto rounded-none bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-xs font-bold px-6"
              >
                {searchLoading ? "Searching…" : "Locate"}
              </Button>
            </form>
          </FadeUp>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 flex-1 space-y-20">

        {/* ── Pincode search results ── */}
        {searchPincode && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold">
                {searchLoading
                  ? "Searching…"
                  : isError
                  ? "Search Error"
                  : `Nearest dealers to ${searchPincode}`}
              </h2>
              <button
                onClick={clearSearch}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors uppercase tracking-wider font-semibold"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            </div>

            {searchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-52 bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12 bg-red-50 border border-red-100 text-red-500">
                Unable to find dealers for this pincode. Please try another.
              </div>
            ) : nearbyDealers && nearbyDealers.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyDealers.map((dealer) => (
                  <StaggerItem key={dealer.id}>
                    <DealerCard
                      dealer={dealer}
                      highlight
                      onClick={() => setSelectedDealer(dealer)}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="text-center py-16 bg-gray-50 border border-gray-100">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No dealers found near <strong>{searchPincode}</strong>.</p>
                <p className="text-sm text-gray-400 mt-1">Try a different pincode or browse the full list below.</p>
              </div>
            )}
          </section>
        )}

        {/* ── All dealers list ── */}
        <section>
          <FadeUp className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Our Network</span>
              <h2 className="text-2xl font-serif font-bold mt-1">All Dealers &amp; Distributors</h2>
            </div>
            {allDealers && (
              <span className="text-sm text-gray-400 font-medium uppercase tracking-widest">
                {allDealers.length} Dealers
              </span>
            )}
          </FadeUp>

          {allLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : pagedDealers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No dealers available.</div>
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pagedDealers.map((dealer) => (
                  <StaggerItem key={dealer.id}>
                    <DealerRow dealer={dealer} onClick={() => setSelectedDealer(dealer)} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 text-sm font-semibold border transition-colors ${
                        p === page
                          ? "bg-black text-white border-black"
                          : "border-gray-200 hover:border-black"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Footer />

      {/* ── Dealer detail popup ── */}
      <Dialog open={!!selectedDealer} onOpenChange={(open) => !open && setSelectedDealer(null)}>
        <DialogContent className="max-w-md rounded-none p-0 gap-0 overflow-hidden">
          {selectedDealer && (
            <>
              {/* Accent top bar */}
              <div className="h-1.5 bg-[#b5ffc5] w-full" />

              <div className="p-8">
                <DialogHeader className="mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#b5ffc5] flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-serif font-bold leading-tight text-left">
                        {selectedDealer.firm_name}
                      </DialogTitle>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
                        Authorised Dealer · Sardar Bio Organic
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-5 text-sm text-gray-700">
                  <div className="flex gap-4 items-start">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="leading-relaxed">{selectedDealer.address}</p>
                      <p className="text-gray-400 mt-0.5">Pincode: {selectedDealer.pincode}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                    <a
                      href={`tel:${selectedDealer.contact}`}
                      className="hover:text-primary font-medium transition-colors"
                    >
                      {selectedDealer.contact}
                    </a>
                  </div>

                  {selectedDealer.email && (
                    <div className="flex gap-4 items-center">
                      <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                      <a
                        href={`mailto:${selectedDealer.email}`}
                        className="hover:text-primary transition-colors break-all"
                      >
                        {selectedDealer.email}
                      </a>
                    </div>
                  )}

                  {"distance_km" in selectedDealer && selectedDealer.distance_km !== undefined && (
                    <div className="inline-flex items-center gap-2 bg-[#b5ffc5]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-black">
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
                    className="mt-8 flex items-center justify-center gap-2 w-full bg-black text-white py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
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

/* ── Sub-components ─────────────────────────────────────────── */

function DealerCard({
  dealer,
  highlight,
  onClick,
}: {
  dealer: AnyDealer;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={`card-dealer-${dealer.id}`}
      className={`w-full text-left p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group ${
        highlight ? "border-[#b5ffc5] bg-[#b5ffc5]/5" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
          {dealer.firm_name}
        </h3>
        {"distance_km" in dealer && dealer.distance_km !== undefined && (
          <span className="bg-black text-white text-[10px] px-2 py-1 font-mono font-bold ml-3 shrink-0">
            {(dealer.distance_km as number).toFixed(1)} km
          </span>
        )}
      </div>
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex gap-2 items-start">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
          <span className="line-clamp-2">{dealer.address}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Phone className="w-4 h-4 shrink-0 text-gray-400" />
          <span>{dealer.contact}</span>
        </div>
      </div>
      <div className="mt-4 text-[10px] uppercase tracking-widest font-bold text-primary">
        View Details →
      </div>
    </button>
  );
}

function DealerRow({ dealer, onClick }: { dealer: AnyDealer; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-testid={`row-dealer-${dealer.id}`}
      className="w-full text-left flex items-center gap-5 p-5 border border-gray-100 hover:border-primary hover:bg-[#b5ffc5]/5 transition-all duration-200 group"
    >
      <div className="w-11 h-11 bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#b5ffc5] transition-colors">
        <Building2 className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
          {dealer.firm_name}
        </div>
        <div className="text-xs text-gray-400 mt-0.5 truncate">{dealer.address}</div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-gray-400 hidden sm:block">{dealer.pincode}</span>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
      </div>
    </button>
  );
}
