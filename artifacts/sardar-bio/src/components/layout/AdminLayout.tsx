import { useAdminMe, getAdminMeQueryKey, useAdminLogout } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { LayoutDashboard, Package, MapPin, FileText, MessageSquare, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const logout = useAdminLogout();
  
  const { data: user, isError, isLoading } = useAdminMe({
    query: {
      queryKey: getAdminMeQueryKey(),
      retry: false
    }
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("admin_token");
      setLocation("/admin");
    }
  }, [isError, setLocation]);

  const handleLogout = () => {
    logout.mutate({}, {
      onSettled: () => {
        localStorage.removeItem("admin_token");
        queryClient.clear();
        setLocation("/admin");
      }
    });
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/dealers", label: "Dealers", icon: MapPin },
    { href: "/admin/content", label: "Content", icon: FileText },
    { href: "/admin/submissions", label: "Submissions", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col hidden md:flex fixed h-full z-10">
        <div className="p-8 border-b border-gray-800">
          <div className="font-serif text-xl font-bold tracking-tight">SARDAR BIO</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Admin Portal</div>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between md:justify-end sticky top-0 z-10">
          <div className="md:hidden font-serif font-bold">SARDAR BIO</div>
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            {user.email}
          </div>
        </header>
        <div className="p-8 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
