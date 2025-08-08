import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UploadPage from "./pages/Upload";
import DocumentsPage from "./pages/Documents";
import DocumentViewerPage from "./pages/DocumentViewer";
import QueryPage from "./pages/Query";
import AuditLogPage from "./pages/AuditLog";
import SettingsPage from "./pages/Settings";
import { AppDataProvider } from "./context/AppDataProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppDataProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/:docId" element={<DocumentViewerPage />} />
            <Route path="/query" element={<QueryPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppDataProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
