import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, getListProductsQueryKey, useGetUploadUrl, Product } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const { data: products, isLoading } = useListProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const getUploadUrl = useGetUploadUrl();

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setImages(product.images || []);
    } else {
      setEditingProduct(null);
      setImages([]);
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { upload_url, public_url } = await getUploadUrl.mutateAsync({
        data: { filename: file.name, content_type: file.type }
      });

      await fetch(upload_url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
      });

      setImages([...images, public_url]);
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      benefits: formData.get("benefits") as string,
      application_method: formData.get("application_method") as string,
      things_to_know: formData.get("things_to_know") as string,
      available_packaging: formData.get("available_packaging") as string,
      category: formData.get("category") as string,
      form: formData.get("form") as string,
      featured: formData.get("featured") === "true",
      images
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          setIsDialogOpen(false);
          toast({ title: "Product updated" });
        }
      });
    } else {
      createProduct.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          setIsDialogOpen(false);
          toast({ title: "Product created" });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "Product deleted" });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-2">Manage your catalog.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-xs font-bold px-6">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-none">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">{editingProduct ? "Edit Product" : "New Product"}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Name *</label>
                  <Input name="name" defaultValue={editingProduct?.name} required className="rounded-none border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category *</label>
                  <select name="category" defaultValue={editingProduct?.category || "bio-pesticide"} className="w-full h-10 px-3 border border-gray-300 rounded-none uppercase tracking-wide text-sm bg-white">
                    <option value="bio-pesticide">Bio Pesticide</option>
                    <option value="insecticide">Insecticide</option>
                    <option value="fungicide">Fungicide</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Form *</label>
                  <select name="form" defaultValue={editingProduct?.form || "liquid"} className="w-full h-10 px-3 border border-gray-300 rounded-none uppercase tracking-wide text-sm bg-white">
                    <option value="liquid">Liquid</option>
                    <option value="powder">Powder</option>
                    <option value="granules">Granules</option>
                  </select>
                </div>
                <div className="space-y-2 flex items-center gap-4 mt-6">
                  <input type="checkbox" name="featured" id="featured" value="true" defaultChecked={editingProduct?.featured} className="w-5 h-5 text-primary rounded-none" />
                  <label htmlFor="featured" className="text-xs font-bold uppercase tracking-widest text-gray-700">Featured Product (Shows on Home)</label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Images</label>
                <div className="flex gap-4 flex-wrap mb-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 border border-gray-200">
                      <img src={img} className="w-full h-full object-contain" alt="" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer transition-colors">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">{isUploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Short Description *</label>
                <Textarea name="description" defaultValue={editingProduct?.description} required className="rounded-none border-gray-300" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Technical Content</label>
                <Textarea name="content" defaultValue={editingProduct?.content || ""} className="rounded-none border-gray-300 min-h-[100px]" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Key Benefits</label>
                <Textarea name="benefits" defaultValue={editingProduct?.benefits || ""} className="rounded-none border-gray-300 min-h-[100px]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Application Method</label>
                  <Textarea name="application_method" defaultValue={editingProduct?.application_method || ""} className="rounded-none border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Things to Know</label>
                  <Textarea name="things_to_know" defaultValue={editingProduct?.things_to_know || ""} className="rounded-none border-gray-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Available Packaging</label>
                <Input name="available_packaging" defaultValue={editingProduct?.available_packaging || ""} className="rounded-none border-gray-300" placeholder="e.g. 250ml, 500ml, 1L" />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending} className="bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-xs font-bold px-8">
                  {createProduct.isPending || updateProduct.isPending ? "Saving..." : "Save Product"}
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
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Form</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : products?.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
            ) : (
              products?.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    {product.images?.[0] && <img src={product.images[0]} alt="" className="w-8 h-8 object-cover border border-gray-200 bg-white" />}
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 uppercase text-xs tracking-wider">{product.category.replace('-', ' ')}</td>
                  <td className="px-6 py-4 text-gray-600 uppercase text-xs tracking-wider">{product.form}</td>
                  <td className="px-6 py-4">
                    {product.featured ? <span className="bg-primary/20 text-primary-foreground text-[10px] font-bold uppercase px-2 py-1">Yes</span> : null}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenDialog(product)} className="text-gray-500 hover:text-black p-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-gray-500 hover:text-red-600 p-2 ml-2"><Trash2 className="w-4 h-4" /></button>
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
