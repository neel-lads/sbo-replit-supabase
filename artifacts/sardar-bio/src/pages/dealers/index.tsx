import { useState } from "react";
import { supabase } from "@/lib/supabase";
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
import { MapPin, Phone, Mail, ExternalLink, Building2, X } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/animate";

import { Helmet } from "react-helmet-async";

<Helmet>
  <title>Find Dealers & Distributors | Sardar Bio Organic</title>

  <meta
    name="description"
    content="Locate authorized Sardar Bio Organic dealers and distributors near you. Connect with trusted partners for premium organic agricultural products across Gujarat and beyond."
  />
</Helmet>

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

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Dealers() {

  const [locationFound, setLocationFound] = useState(false);

  const [selectedDealer, setSelectedDealer] = useState<AnyDealer | null>(null);

  const [nearbyDealers, setNearbyDealers] = useState<AnyDealer[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const top3 = nearbyDealers.slice(0, 3);

  const handleSearch = async () => {
    setSearchLoading(true);
    setIsError(false);

    if (!navigator.geolocation) {
      setSearchLoading(false);
      setIsError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const current = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const { data: dealers, error } = await supabase
            .from("dealers")
            .select("*");

          if (error || !dealers) throw error;

          const withDistance = dealers.map((dealer: AnyDealer) => ({
            ...dealer,
            distance_km: calculateDistance(
              current.lat,
              current.lng,
              dealer.lat,
              dealer.lng
            ),
          }));

          withDistance.sort(
            (a, b) => a.distance_km! - b.distance_km!
          );

          setNearbyDealers(withDistance);
          setLocationFound(true);
        } catch (err) {
          console.error(err);
          setIsError(true);
        }

        setSearchLoading(false);
      },
      (error) => {
        console.error(error);

        setSearchLoading(false);
        setIsError(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const clearSearch = () => {
    setLocationFound(false);
    setNearbyDealers([]);
    setSelectedDealer(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header + search */}
      <div
        className="py-24 overflow-hidden relative"
        style={{ background: "#D4FFDD" }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #00C62C 1px, transparent 0)", backgroundSize: "36px 36px" }}
        />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Our Network</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-3 mb-5">
              Find a Dealer
            </h1>
            <p className="text-gray-600 text-base mb-10 leading-relaxed max-w-xl mx-auto">
                Allow location access to instantly discover the nearest authorised Sardar Bio Organic dealers around you.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="max-w-md mx-auto">
              <Button
                onClick={handleSearch}
                disabled={searchLoading}
                className="w-full h-14 rounded-2xl text-white uppercase tracking-widest text-sm font-bold"
                style={{
                  background:
                    "linear-gradient(135deg,#00C62C 0%,#004d11 100%)"
                }}
              >
                <MapPin className="w-5 h-5 mr-2" />

                {searchLoading
                  ? "Locating..."
                  : locationFound
                    ? "Refresh My Location"
                    : "Use My Current Location"}
              </Button>

              <p className="text-xs text-gray-400 mt-4">
                Your location is used only for this search and is never stored.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-20 w-full flex-1">
        {!locationFound ? (
          <FadeUp className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
              <MapPin className="w-8 h-8 text-[#00C62C]" />
            </div>
            <p className="text-gray-500 text-lg">Use your current location to find nearby authorised dealers.</p>
            <p className="text-gray-400 text-sm mt-2">We'll calculate the distance from your exact location for the most accurate results.</p>
          </FadeUp>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Search Results</span>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                  {searchLoading
                    ? "Locating..."
                    : isError
                    ? "Location Error"
                    : `Nearest Dealers`}
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
                Unable to determine your location. Please allow location access and try again.
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
                <p className="text-gray-500 font-medium">No nearby dealers found.</p>
                <p className="text-sm text-gray-400 mt-1">Please try again after enabling location access or contact us directly.</p>
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
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-2 rounded-full text-xs font-semibold text-[#00C62C]">
                      <MapPin className="w-3.5 h-3.5" />
                      ≈{(selectedDealer.distance_km as number).toFixed(1)} km from your location.
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
            ≈{dealer.distance_km.toFixed(1)} km
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
