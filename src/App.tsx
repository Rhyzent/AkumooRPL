import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index.tsx";
import Menu from "./pages/Menu.tsx";
import Tentang from "./pages/Tentang.tsx";
import Pemesanan from "./pages/Pemesanan.tsx";
import Konfirmasi from "./pages/Konfirmasi.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/admin/Login.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Orders from "./pages/admin/Orders.tsx";
import MenuAdmin from "./pages/admin/MenuAdmin.tsx";
import Categories from "./pages/admin/Categories.tsx";
import Promos from "./pages/admin/Promos.tsx";
import Admins from "./pages/admin/Admins.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/tentang" element={<Tentang />} />
              <Route path="/pemesanan" element={<Pemesanan />} />
              <Route path="/konfirmasi" element={<Konfirmasi />} />
            </Route>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="menu" element={<MenuAdmin />} />
              <Route path="categories" element={<Categories />} />
              <Route path="promos" element={<Promos />} />
              <Route path="admins" element={<Admins />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
