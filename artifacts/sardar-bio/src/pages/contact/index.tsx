import { useState } from "react";
import { useCreateContactSubmission, useCreateDealershipSubmission } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="bg-gray-50 py-16 md:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Whether you have a product enquiry, require technical agricultural support, or wish to join our trusted dealer network.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 flex-1">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Contact Info */}
          <div className="lg:w-1/3 flex flex-col gap-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-100">Head Office</h3>
              <div className="flex gap-4 text-gray-600 items-start">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <p>Sardar Bio Organic<br/>123 Agri Business Park<br/>Gujarat, India 380001</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-100">Direct Contact</h3>
              <div className="flex flex-col gap-4 text-gray-600">
                <div className="flex gap-4 items-center">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <p>+91 98765 43210<br/>+91 98765 43211</p>
                </div>
                <div className="flex gap-4 items-center">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <p>info@sardarbio.com<br/>sales@sardarbio.com</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 border border-gray-100">
              <h3 className="font-serif font-bold text-xl mb-2">Business Hours</h3>
              <p className="text-sm text-gray-500">Monday - Saturday<br/>9:30 AM - 6:30 PM IST</p>
            </div>
          </div>

          {/* Forms */}
          <div className="lg:w-2/3">
            <div className="flex border-b border-gray-200 mb-10">
              <button 
                onClick={() => setActiveTab("contact")}
                className={`pb-4 px-6 font-bold uppercase tracking-widest text-sm transition-all relative ${activeTab === "contact" ? "text-primary" : "text-gray-400 hover:text-gray-900"}`}
              >
                Contact Us
                {activeTab === "contact" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
              </button>
              <button 
                onClick={() => setActiveTab("dealership")}
                className={`pb-4 px-6 font-bold uppercase tracking-widest text-sm transition-all relative ${activeTab === "dealership" ? "text-primary" : "text-gray-400 hover:text-gray-900"}`}
              >
                Dealership Enquiry
                {activeTab === "dealership" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
              </button>
            </div>

            {activeTab === "contact" && (
              <form onSubmit={handleContactSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                    <Input name="name" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                    <Input name="email" type="email" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                    <Input name="phone" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Subject</label>
                    <Input name="subject" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                  <Textarea name="message" required className="rounded-none border-gray-300 focus-visible:ring-primary min-h-[150px] resize-none" />
                </div>
                <Button type="submit" disabled={createContact.isPending} className="bg-black text-white hover:bg-gray-800 rounded-none h-14 px-10 uppercase tracking-widest text-sm font-bold mt-4">
                  {createContact.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}

            {activeTab === "dealership" && (
              <form onSubmit={handleDealershipSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Applicant Name</label>
                    <Input name="name" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Firm / Company Name</label>
                    <Input name="firm_name" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                    <Input name="email" type="email" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                    <Input name="phone" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">GST Number</label>
                    <Input name="gst_number" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12 uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Area Pincode</label>
                    <Input name="area_pincode" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Subject</label>
                  <Input name="subject" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Brief Background & Experience</label>
                  <Textarea name="message" required className="rounded-none border-gray-300 focus-visible:ring-primary min-h-[150px] resize-none" />
                </div>
                <Button type="submit" disabled={createDealership.isPending} className="bg-black text-white hover:bg-gray-800 rounded-none h-14 px-10 uppercase tracking-widest text-sm font-bold mt-4">
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
