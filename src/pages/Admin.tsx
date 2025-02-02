import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Store, LayoutDashboard, Package, ShoppingCart, Users, MessageSquare, Star, Megaphone, FileText } from "lucide-react";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminChat } from "@/components/admin/AdminChat";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminCampaigns } from "@/components/admin/AdminCampaigns";
import { AdminBlog } from "@/components/admin/blog/AdminBlog";
import { SessionBadge } from "@/components/admin/chat/components/session-card/SessionBadge";
import { useUnreadAdminMessages } from "@/components/admin/chat/hooks/useUnreadAdminMessages";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: adminStatus, isLoading } = useAdmin();
  const { data: unreadMessages = 0 } = useUnreadAdminMessages();
  const [activeTab, setActiveTab] = useState("analytics");

  const { data: pendingReviewsCount } = useQuery({
    queryKey: ["pending-reviews-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("reviews")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

      if (error) throw error;
      return count || 0;
    },
  });

  useEffect(() => {
    if (!isLoading && !adminStatus?.isAdmin) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
    }
  }, [adminStatus, isLoading, navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!adminStatus?.isAdmin) {
    return null;
  }

  const menuItems = [
    { id: "analytics", label: "Analytics", icon: LayoutDashboard, component: AdminAnalytics },
    { id: "products", label: "Products", icon: Package, component: AdminProducts },
    { id: "campaigns", label: "Campaigns", icon: Megaphone, component: AdminCampaigns },
    { id: "orders", label: "Orders", icon: ShoppingCart, component: AdminOrders },
    { id: "users", label: "Users", icon: Users, component: AdminUsers },
    { id: "reviews", label: "Reviews", icon: Star, component: AdminReviews, badge: pendingReviewsCount },
    { id: "chat", label: "Chat", icon: MessageSquare, component: AdminChat, badge: unreadMessages },
    { id: "blog", label: "Blog", icon: FileText, component: AdminBlog },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <div className="fixed z-50">
          <Sidebar className="w-[60px] hover:w-64 transition-all duration-300 group">
            <SidebarContent>
              <div className="mb-4 px-4">
                <Link to="/">
                  <Button variant="outline" className="w-full gap-2 overflow-hidden whitespace-nowrap">
                    <Store className="h-4 w-4 flex-shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Store</span>
                  </Button>
                </Link>
              </div>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2 relative ${
                        activeTab === item.id ? "bg-accent" : ""
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {item.label}
                      </span>
                      {item.badge > 0 && (
                        <SessionBadge count={item.badge} />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </div>

        <main className="flex-1 p-8 ml-[60px]">
          <SidebarTrigger className="mb-4" />
          <div className="space-y-4">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
