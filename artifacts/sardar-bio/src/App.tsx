import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/products/[id]";
import Dealers from "@/pages/dealers";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin/login";
// Import placeholder for admin pages to build next
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminDealers from "@/pages/admin/dealers";
import AdminContent from "@/pages/admin/content";
import AdminSubmissions from "@/pages/admin/submissions";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/dealers" component={Dealers} />
      <Route path="/contact" component={Contact} />
      
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/dealers" component={AdminDealers} />
      <Route path="/admin/content" component={AdminContent} />
      <Route path="/admin/submissions" component={AdminSubmissions} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
