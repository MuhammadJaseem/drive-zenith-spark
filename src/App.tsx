import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import StaticIndex from "./pages/StaticIndex";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import VehicleDetails from "./pages/VehicleDetails";
import StaticVehicleDetails from "./pages/StaticVehicleDetails";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<StaticIndex />} />
            <Route path="/dynamic" element={<Index />} />
            <Route
              path="/vehicle/:vehicleId"
              element={
                <PrivateRoute>
                  <VehicleDetails />
                </PrivateRoute>
              }
            />
            <Route path="/rent-a-:vehicleSlug" element={<StaticVehicleDetails />} />
            <Route path="/rent/:vehicleSlug" element={<StaticVehicleDetails />} />
            <Route path="/vehicle-details" element={<StaticVehicleDetails />} />
            <Route path="/:vehicleSlug" element={<StaticVehicleDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
