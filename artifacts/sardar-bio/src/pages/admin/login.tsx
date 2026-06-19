import { useAdminLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAdminLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    login.mutate({ data: { email, password } }, {
      onSuccess: (session) => {
        localStorage.setItem("admin_token", session.access_token);
        setLocation("/admin/dashboard");
      },
      onError: () => {
        toast({ variant: "destructive", title: "Authentication Failed", description: "Invalid credentials." });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-10 border border-gray-200 shadow-xl">
        <div className="text-center mb-10">
          <div className="font-serif text-2xl font-bold tracking-tight mb-2">SARDAR BIO</div>
          <h1 className="text-sm font-bold uppercase tracking-widest text-gray-500">Admin Portal</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
            <Input name="email" type="email" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
            <Input name="password" type="password" required className="rounded-none border-gray-300 focus-visible:ring-primary h-12" />
          </div>
          <Button type="submit" disabled={login.isPending} className="w-full bg-black text-white hover:bg-gray-800 rounded-none h-14 uppercase tracking-widest text-sm font-bold mt-8">
            {login.isPending ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
