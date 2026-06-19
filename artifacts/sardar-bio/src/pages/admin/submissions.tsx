import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListContactSubmissions, useListDealershipSubmissions } from "@workspace/api-client-react";
import { Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { format } from "date-fns";

export default function AdminSubmissions() {
  const [activeTab, setActiveTab] = useState<"contact" | "dealership">("contact");
  
  const { data: contacts, isLoading: loadingContacts } = useListContactSubmissions();
  const { data: dealerships, isLoading: loadingDealerships } = useListDealershipSubmissions();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Submissions</h1>
        <p className="text-gray-500 mt-2">View enquiries from the website.</p>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab("contact")}
          className={`pb-4 px-6 font-bold uppercase tracking-widest text-sm transition-all relative ${activeTab === "contact" ? "text-primary" : "text-gray-400 hover:text-gray-900"}`}
        >
          Contact Messages
          {activeTab === "contact" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
        </button>
        <button 
          onClick={() => setActiveTab("dealership")}
          className={`pb-4 px-6 font-bold uppercase tracking-widest text-sm transition-all relative ${activeTab === "dealership" ? "text-primary" : "text-gray-400 hover:text-gray-900"}`}
        >
          Dealership Enquiries
          {activeTab === "dealership" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
        </button>
      </div>

      {activeTab === "contact" && (
        <div className="space-y-6">
          {loadingContacts ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : contacts?.length === 0 ? (
            <div className="bg-white p-12 text-center border border-gray-200">
              <p className="text-gray-500">No contact messages received yet.</p>
            </div>
          ) : (
            contacts?.map(sub => (
              <div key={sub.id} className="bg-white p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-lg">{sub.subject}</h3>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">From: {sub.name}</div>
                  </div>
                  <div className="text-xs text-gray-400">{format(new Date(sub.created_at), 'MMM d, yyyy h:mm a')}</div>
                </div>
                <p className="text-gray-700 whitespace-pre-line mb-6">{sub.message}</p>
                <div className="flex gap-6 text-sm text-gray-500 bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> <a href={`mailto:${sub.email}`} className="hover:text-primary">{sub.email}</a></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {sub.phone}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "dealership" && (
        <div className="space-y-6">
          {loadingDealerships ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : dealerships?.length === 0 ? (
            <div className="bg-white p-12 text-center border border-gray-200">
              <p className="text-gray-500">No dealership enquiries received yet.</p>
            </div>
          ) : (
            dealerships?.map(sub => (
              <div key={sub.id} className="bg-white p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-lg">{sub.subject}</h3>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">Firm: {sub.firm_name} | Applicant: {sub.name}</div>
                  </div>
                  <div className="text-xs text-gray-400">{format(new Date(sub.created_at), 'MMM d, yyyy h:mm a')}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="col-span-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Background & Experience</h4>
                    <p className="text-gray-700 whitespace-pre-line">{sub.message}</p>
                  </div>
                  <div className="bg-gray-50 p-4 border border-gray-100 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600"><Mail className="w-4 h-4 shrink-0 text-gray-400" /> <span className="truncate">{sub.email}</span></div>
                    <div className="flex items-center gap-3 text-sm text-gray-600"><Phone className="w-4 h-4 shrink-0 text-gray-400" /> <span>{sub.phone}</span></div>
                    <div className="flex items-center gap-3 text-sm text-gray-600"><MapPin className="w-4 h-4 shrink-0 text-gray-400" /> <span>Pincode: {sub.area_pincode}</span></div>
                    <div className="flex items-center gap-3 text-sm text-gray-600"><Briefcase className="w-4 h-4 shrink-0 text-gray-400" /> <span>GST: {sub.gst_number}</span></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
}
