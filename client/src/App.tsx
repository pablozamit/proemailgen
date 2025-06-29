import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import EmailGenerator from "@/pages/email-generator";
import ClientsManagement from "@/pages/clients-management";
import ProductsManagement from "@/pages/products-management";
import CopywritersManagement from "@/pages/copywriters-management";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={EmailGenerator} />
      <Route path="/clients" component={ClientsManagement} />
      <Route path="/products" component={ProductsManagement} />
      <Route path="/copywriters" component={CopywritersManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
