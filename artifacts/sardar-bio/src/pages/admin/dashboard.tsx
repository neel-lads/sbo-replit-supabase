import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetProductStats, useGetSubmissionStats, useListDealers } from "@workspace/api-client-react";
import { Package, MapPin, MessageSquare, Briefcase } from "lucide-react";

export default function AdminDashboard() {
  const { data: productStats } = useGetProductStats();
  const { data: submissionStats } = useGetSubmissionStats();
  const { data: dealers } = useListDealers();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of Sardar Bio Organic operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Total Products</div>
            <div className="text-3xl font-serif font-bold">{productStats?.total || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Dealers</div>
            <div className="text-3xl font-serif font-bold">{dealers?.length || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Contact Msgs</div>
            <div className="text-3xl font-serif font-bold">{submissionStats?.contact_total || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-orange-50 text-orange-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Dealer Enquiries</div>
            <div className="text-3xl font-serif font-bold">{submissionStats?.dealership_total || 0}</div>
          </div>
        </div>
      </div>
      
      {productStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 border border-gray-200 shadow-sm">
            <h3 className="font-serif font-bold text-lg mb-6">Products by Category</h3>
            <div className="space-y-4">
              {productStats.by_category.map((cat) => (
                <div key={cat.label} className="flex items-center justify-between">
                  <div className="text-sm font-medium uppercase tracking-wider text-gray-600">{cat.label.replace('-', ' ')}</div>
                  <div className="font-bold">{cat.count}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-sm">
            <h3 className="font-serif font-bold text-lg mb-6">Products by Form</h3>
            <div className="space-y-4">
              {productStats.by_form.map((form) => (
                <div key={form.label} className="flex items-center justify-between">
                  <div className="text-sm font-medium uppercase tracking-wider text-gray-600">{form.label}</div>
                  <div className="font-bold">{form.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
