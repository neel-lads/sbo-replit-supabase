import { useState } from "react";
import { useLocateDealers, useGetContent } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Search } from "lucide-react";

export default function Dealers() {
  const [pincode, setPincode] = useState("");
  const [searchPincode, setSearchPincode] = useState<string | null>(null);
  
  const { data: introText } = useGetContent("dealer_intro");
  
  // Only query when searchPincode is set
  const { data: dealers, isLoading, isError } = useLocateDealers(
    { pincode: searchPincode || "" }, 
    { query: { enabled: !!searchPincode } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setSearchPincode(pincode);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="bg-primary/10 py-20 border-b border-primary/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Find a Dealer</h1>
          <p className="text-gray-700 text-lg mb-10 leading-relaxed">
            {introText?.value || "Our trusted network of dealers ensures you have access to Sardar Bio Organic solutions wherever your farm is located."}
          </p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <Input 
              type="text" 
              placeholder="Enter 6-digit Pincode" 
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-14 pl-12 pr-32 text-lg rounded-none border-gray-300 focus-visible:ring-primary shadow-sm"
              required
            />
            <Button 
              type="submit" 
              disabled={pincode.length !== 6 || isLoading}
              className="absolute right-1 top-1 bottom-1 h-auto rounded-none bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-xs font-bold px-6"
            >
              Locate
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 flex-1">
        {!searchPincode ? (
          <div className="text-center py-20 text-gray-400">
            <MapPin className="w-16 h-16 mx-auto mb-6 opacity-20" />
            <p className="text-lg">Enter your pincode to find the nearest Sardar Bio Organic dealers.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 border border-gray-100 animate-pulse"></div>)}
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500">
            <p>An error occurred while searching for dealers. Please try again.</p>
          </div>
        ) : dealers && dealers.length > 0 ? (
          <div>
            <h2 className="text-2xl font-serif font-bold mb-8">Nearest Dealers ({dealers.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dealers.map((dealer) => (
                <div key={dealer.id} className="bg-white p-8 border border-gray-200 hover:border-primary transition-colors flex flex-col h-full shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{dealer.firm_name}</h3>
                    {dealer.distance_km !== undefined && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 font-mono font-medium rounded-sm whitespace-nowrap ml-4">
                        {dealer.distance_km.toFixed(1)} km
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-4 text-gray-600 text-sm flex-1 mb-8">
                    <div className="flex gap-3 items-start">
                      <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <span>{dealer.address}, <br/>Pincode: {dealer.pincode}</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <span>{dealer.contact}</span>
                    </div>
                    {dealer.email && (
                      <div className="flex gap-3 items-start">
                        <Mail className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <a href={`mailto:${dealer.email}`} className="hover:text-primary transition-colors">{dealer.email}</a>
                      </div>
                    )}
                  </div>
                  
                  {dealer.map_link && (
                    <a 
                      href={dealer.map_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-center border border-black text-black py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors mt-auto"
                    >
                      View on Map
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 border border-gray-100">
            <p className="text-gray-500 mb-4">No dealers found near pincode <strong>{searchPincode}</strong>.</p>
            <p className="text-sm">Please try a different pincode or contact us directly.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
