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
    if (pincode.length === 6) setSearchPincode(pincode);
  };

  const clearSearch = () => {
    setSearchPincode(null);
    setPincode("");
  };

  const totalPages = Math.ceil((allDealers?.length ?? 0) / PAGE_SIZE);
  const pagedDealers = allDealers?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header + search */}
      <div className="bg-gradient-to-br from-green-50 to-white border-b border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center max-w-3xl">
          <FadeUp>
            <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Our Network</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-3 mb-6">
              Find a Dealer
            </h1>
            <p className="text-gray-500 text-base mb-10 leading-relaxed max-w-xl mx-auto">
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
                className="h-14 pl-12 pr-36 text-base rounded-2xl border-gray-200 focus-visible:ring-[#00C62C]/30 focus-visible:border-[#00C62C] shadow-sm"
                required
              />
              <Button
                type="submit"
                disabled={pincode.length !== 6 || searchLoading}
                data-testid="button-locate"
                className="absolute right-1.5 top-1.5 bottom-1.5 h-auto rounded-xl bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white hover:opacity-90 uppercase tracking-widest text-xs font-bold px-6 border-0 shadow-none"
              >
                {searchLoading ? "Searching…" : "Locate"}
              </Button>
            </form>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 w-full flex-1 space-y-20">

        {/* ── Pincode search results ── */}
        {searchPincode && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                {searchLoading ? "Searching…" : isError ? "Search Error" : `Nearest dealers to ${searchPincode}`}
              </h2>
              <button
                onClick={clearSearch}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors font-medium"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            </div>

            {searchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-52 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100 text-red-500">
                Unable to find dealers for this pincode. Please try another.
              </div>
            ) : nearbyDealers && nearbyDealers.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {nearbyDealers.map((dealer) => (
                  <StaggerItem key={dealer.id}>
                    <DealerCard dealer={dealer} highlight onClick={() => setSelectedDealer(dealer)} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
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
              <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Our Network</span>
              <h2 className="text-2xl font-serif font-bold mt-1 text-gray-900">All Dealers &amp; Distributors</h2>
            </div>
            {allDealers && (
              <span className="text-sm text-gray-400 font-medium">
                {allDealers.length} Dealers
              </span>
            )}
          </FadeUp>

          {allLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : pagedDealers.length === 0 ? (
            <div className="text-center py-16 text-gray-400 rounded-2xl bg-gray-50">No dealers available.</div>
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pagedDealers.map((dealer) => (
                  <StaggerItem key={dealer.id}>
                    <DealerRow dealer={dealer} onClick={() => setSelectedDealer(dealer)} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:border-[#00C62C] hover:text-[#00C62C] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 text-sm font-semibold rounded-xl border transition-colors ${
                        p === page
                          ? "bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white border-transparent"
                          : "border-gray-200 hover:border-[#00C62C] hover:text-[#00C62C]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:border-[#00C62C] hover:text-[#00C62C] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
        <DialogContent className="max-w-md rounded-3xl p-0 gap-0 overflow-hidden border-0 shadow-2xl">
          {selectedDealer && (
            <>
              <div className="h-2 bg-gradient-to-r from-[#00C62C] to-[#00a325] w-full" />
              <div className="p-8">
                <DialogHeader className="mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00C62C] to-[#00a325] flex items-center justify-center flex-shrink-0 shadow-sm">
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

                <div className="space-y-4 text-sm text-gray-600">
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

                  {"distance_km" in selectedDealer && selectedDealer.distance_km !== undefined && (
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
                    className="mt-6 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white py-3.5 text-sm font-bold rounded-2xl hover:opacity-90 transition-opacity"
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

function DealerCard({ dealer, highlight, onClick }: { dealer: AnyDealer; highlight?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-testid={`card-dealer-${dealer.id}`}
      className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group ${
        highlight ? "border-[#00C62C]/30 bg-green-50" : "border-gray-100 bg-white hover:border-[#00C62C]/20"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif font-bold text-gray-900 leading-tight group-hover:text-[#00C62C] transition-colors">
          {dealer.firm_name}
        </h3>
        {"distance_km" in dealer && dealer.distance_km !== undefined && (
          <span className="bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white text-[10px] px-2.5 py-1 font-bold ml-3 shrink-0 rounded-full">
            {(dealer.distance_km as number).toFixed(1)} km
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

function DealerRow({ dealer, onClick }: { dealer: AnyDealer; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-testid={`row-dealer-${dealer.id}`}
      className="w-full text-left flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#00C62C]/30 hover:bg-green-50/50 transition-all duration-200 group"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#00C62C] group-hover:to-[#00a325] transition-all">
        <Building2 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 group-hover:text-[#00C62C] transition-colors truncate text-sm">
          {dealer.firm_name}
        </div>
        <div className="text-xs text-gray-400 mt-0.5 truncate">{dealer.address}</div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-gray-400 hidden sm:block">{dealer.pincode}</span>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#00C62C] transition-colors" />
      </div>
    </button>
  );
}
