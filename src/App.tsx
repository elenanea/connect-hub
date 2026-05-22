import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EnterprisesCatalog from "./pages/EnterprisesCatalog";
import MarketplaceCatalog from "./pages/MarketplaceCatalog";
import MarketplaceItemPage from "./pages/MarketplaceItemPage";
import EnterpriseProfile from "./pages/EnterpriseProfile";
import AnalyticsPage from "./pages/AnalyticsPage";
import ChatPage from "./pages/ChatPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NewsArticle from "./pages/NewsArticle";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import NewsListPage from "./pages/NewsListPage";
import EnterpriseCabinetPage from "./pages/EnterpriseCabinetPage";
import FloatingAIAssistant from "./components/FloatingAIAssistant";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/enterprises" element={<EnterprisesCatalog />} />
          <Route path="/marketplace" element={<MarketplaceCatalog />} />
          <Route path="/marketplace/:enterpriseSlug/:type/:itemSlug" element={<MarketplaceItemPage />} />
          <Route path="/enterprise/:slug" element={<EnterpriseProfile />} />
          <Route path="/enterprise/:slug/cabinet" element={<EnterpriseCabinetPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingAIAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
