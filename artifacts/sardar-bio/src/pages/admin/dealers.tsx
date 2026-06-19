import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListDealers, useCreateDealer, useUpdateDealer, useDeleteDealer, getListDealersQueryKey, Dealer } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDealers() {
  const { data: dealers, isLoading } = useListDealers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createDealer = useCreateDealer();
  const updateDealer = useUpdateDealer();
  const deleteDealer = useDeleteDealer();

  const handleOpenDialog = (dealer?: Dealer) => {
    setEditingDealer(dealer || null);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      firm_name: formData.get("firm_name") as string,
      contact: formData.get("contact") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      pincode: formData.get("pincode") as string,
      lat: parseFloat(formData.get("lat") as string),
      lng: parseFloat(formData.get("lng") as string),
      map_link: formData.get("map_link") as string,
    };

    if (editingDealer) {
      updateDealer.mutate({ id: editingDealer.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDealersQueryKey() });
          setIsDialogOpen(false);
          toast({ title: "Dealer updated" });
        }
      });
    } else {
      createDealer.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDealersQueryKey() });
          setIsDialogOpen(false);
          toast({ title: "Dealer created" });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this dealer?")) {
      deleteDealer.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDealersQueryKey() });
          toast({ title: "Dealer deleted" });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Dealers</h1>
          <p className="text-gray-500 mt-2">Manage your distributor network.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-xs font-bold px-6">
              <Plus className="w-4 h-4 mr-2" /> Add Dealer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white rounded-none">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">{editingDealer ? "Edit Dealer" : "New Dealer"}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Firm Name *</label>
                  <Input name="firm_name" defaultValue={editingDealer?.firm_name} required className="rounded-none border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Contact Person/Phone *</label>
                  <Input name="contact" defaultValue={editingDealer?.contact} required className="rounded-none border-gray-300" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                  <Input name="email" type="email" defaultValue={editingDealer?.email || ""} className="rounded-none border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Pincode *</label>
                  <Input name="pincode" defaultValue={editingDealer?.pincode} required className="rounded-none border-gray-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Address *</label>
                <Input name="address" defaultValue={editingDealer?.address} required className="rounded-none border-gray-300" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Latitude *</label>
                  <Input name="lat" type="number" step="any" defaultValue={editingDealer?.lat} required className="rounded-none border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Longitude *</label>
                  <Input name="lng" type="number" step="any" defaultValue={editingDealer?.lng} required className="rounded-none border-gray-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Google Maps Link</label>
                <Input name="map_link" type="url" defaultValue={editingDealer?.map_link || ""} className="rounded-none border-gray-300" />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit" disabled={createDealer.isPending || updateDealer.isPending} className="bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-xs font-bold px-8">
                  {createDealer.isPending || updateDealer.isPending ? "Saving..." : "Save Dealer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase tracking-widest bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Firm</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Pincode</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : dealers?.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No dealers found.</td></tr>
            ) : (
              dealers?.map(dealer => (
                <tr key={dealer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{dealer.firm_name}</td>
                  <td className="px-6 py-4 text-gray-600">{dealer.contact}</td>
                  <td className="px-6 py-4 text-gray-600">{dealer.pincode}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenDialog(dealer)} className="text-gray-500 hover:text-black p-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(dealer.id)} className="text-gray-500 hover:text-red-600 p-2 ml-2"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
