import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileForm from "@/components/ProfileForm";
import OrdersList from "@/components/OrdersList";

export default function Profile() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
