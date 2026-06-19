import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetContent, useUpsertContent, getGetContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

function ContentEditor({ contentKey, label, description }: { contentKey: string, label: string, description: string }) {
  const { data } = useGetContent(contentKey, {
    query: { queryKey: getGetContentQueryKey(contentKey) }
  });
  const upsert = useUpsertContent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [value, setValue] = useState("");

  useEffect(() => {
    if (data?.value) {
      setValue(data.value);
    }
  }, [data]);

  const handleSave = () => {
    upsert.mutate({ key: contentKey, data: { value } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetContentQueryKey(contentKey) });
        toast({ title: "Content updated successfully" });
      }
    });
  };

  return (
    <div className="bg-white p-8 border border-gray-200 shadow-sm mb-8">
      <div className="mb-6">
        <h3 className="font-serif font-bold text-xl">{label}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      <Textarea 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        className="min-h-[150px] rounded-none border-gray-300 focus-visible:ring-primary mb-4" 
      />
      <Button 
        onClick={handleSave} 
        disabled={upsert.isPending}
        className="bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-xs font-bold px-6"
      >
        {upsert.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}

export default function AdminContent() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-500 mt-2">Update static text across the website.</p>
      </div>

      <ContentEditor 
        contentKey="about_us" 
        label="About Us Text (Home Page)" 
        description="The paragraph shown in the 'Rooted in Experience' section on the homepage."
      />
      
      <ContentEditor 
        contentKey="founders_note" 
        label="Founder's Note (Home Page)" 
        description="The large quote block displayed at the bottom of the homepage."
      />

      <ContentEditor 
        contentKey="dealer_intro" 
        label="Dealers Page Introduction" 
        description="The text displayed above the pincode search on the Dealers page."
      />
    </AdminLayout>
  );
}
