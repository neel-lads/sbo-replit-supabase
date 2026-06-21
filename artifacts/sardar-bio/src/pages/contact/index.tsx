import { useState } from "react";
import { useCreateContactSubmission, useCreateDealershipSubmission } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [activeTab, setActiveTab] = useState<"contact" | "dealership">("contact");
  const { toast } = useToast();

  const createContact = useCreateContactSubmission();
  const createDealership = useCreateDealershipSubmission();

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };
    createContact.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Message sent", description: "We'll get back to you shortly." });
        (e.target as HTMLFormElement).reset();
      },
      onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to send message." })
    });
  };

  const handleDealershipSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      firm_name: formData.get("firm_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      gst_number: formData.get("gst_number") as string,
      area_pincode: formData.get("area_pincode") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };
    createDealership.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Application submitted", description: "Our team will review your enquiry." });
        (e.target as HTMLFormElement).reset();
      },
      onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to submit application." })
    });
  };

  const inputClass = "rounded-xl border-gray-200 focus-visible:ring-[#00C62C]/30 focus-visible:border-[#00C62C] h-12 transition-all";
  const labelClass = "text-xs font-semibold uppercase tracking-widest text-gray-500";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="bg-gradient-to-br from-green-50 to-white border-b border-gray-100 py-16 md:py-24" style={{background: #D4FFDD}}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] uppercase tracking-widest text-[#00C62C] font-semibold">Reach Us</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-3 mb-5">Get in Touch</h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you have a product enquiry, require technical support, or wish to join our trusted dealer network.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Contact Info */}
          <div className="lg:w-80 flex flex-col gap-6 flex-shrink-0">
            {[
              {
                icon: <MapPin className="w-5 h-5 text-[#00C62C]" />,
                label: "Head Office",
                content: <>Sardar Bio Organic<br />123 Agri Business Park<br />Gujarat, India 380001</>
              },
              {
                icon: <Phone className="w-5 h-5 text-[#00C62C]" />,
                label: "Phone",
                content: <>+91 98765 43210<br />+91 98765 43211</>
              },
              {
                icon: <Mail className="w-5 h-5 text-[#00C62C]" />,
                label: "Email",
                content: <>info@sardarbio.com<br />sales@sardarbio.com</>
              },
              {
                icon: <Clock className="w-5 h-5 text-[#00C62C]" />,
                label: "Business Hours",
                content: <>Monday - Saturday<br />9:30 AM – 6:30 PM IST</>
              },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 items-start bg-gray-50 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Forms */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex gap-2 mb-10 bg-gray-100 rounded-2xl p-1.5">
              <button
                onClick={() => setActiveTab("contact")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "contact"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Contact Us
              </button>
              <button
                onClick={() => setActiveTab("dealership")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "dealership"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dealership Enquiry
              </button>
            </div>

            {activeTab === "contact" && (
              <form onSubmit={handleContactSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className={labelClass}>Full Name</label>
                    <Input name="name" required className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Email Address</label>
                    <Input name="email" type="email" required className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className={labelClass}>Phone Number</label>
                    <Input name="phone" required className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Subject</label>
                    <Input name="subject" required className={inputClass} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Message</label>
                  <Textarea name="message" required className="rounded-xl border-gray-200 focus-visible:ring-[#00C62C]/30 focus-visible:border-[#00C62C] min-h-[140px] resize-none transition-all" />
                </div>
                <Button
                  type="submit"
                  disabled={createContact.isPending}
                  className="bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white hover:opacity-90 rounded-full h-12 px-10 uppercase tracking-wider text-sm font-semibold mt-2 shadow-md shadow-green-200 border-0"
                >
                  {createContact.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}

            {activeTab === "dealership" && (
              <form onSubmit={handleDealershipSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className={labelClass}>Applicant Name</label>
                    <Input name="name" required className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Firm / Company Name</label>
                    <Input name="firm_name" required className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className={labelClass}>Email Address</label>
                    <Input name="email" type="email" required className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Phone Number</label>
                    <Input name="phone" required className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className={labelClass}>GST Number</label>
                    <Input name="gst_number" required className={`${inputClass} uppercase`} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Area Pincode</label>
                    <Input name="area_pincode" required className={inputClass} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Subject</label>
                  <Input name="subject" required className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Brief Background & Experience</label>
                  <Textarea name="message" required className="rounded-xl border-gray-200 focus-visible:ring-[#00C62C]/30 focus-visible:border-[#00C62C] min-h-[140px] resize-none transition-all" />
                </div>
                <Button
                  type="submit"
                  disabled={createDealership.isPending}
                  className="bg-gradient-to-r from-[#00C62C] to-[#00a325] text-white hover:opacity-90 rounded-full h-12 px-10 uppercase tracking-wider text-sm font-semibold mt-2 shadow-md shadow-green-200 border-0"
                >
                  {createDealership.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
