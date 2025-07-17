import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";

import Dashboard from "./pages/Index";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Inventory from "./pages/Inventory";
import POS from "./pages/POS";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import Customization from "./pages/Customization";
import Profile from "./pages/Profile";
import EntityPage from "./pages/EntityPage";
import AITools from "./pages/AITools";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/customization" element={<Customization />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/entity/:entityName" element={<EntityPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
