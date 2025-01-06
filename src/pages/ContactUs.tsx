import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/home/Footer";
import { Mail, Phone, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            We're here to help! Get in touch with us through any of the following methods.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Customer Support</h2>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    support@yourstore.com
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    (555) 123-4567
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Monday - Friday, 9am - 5pm EST
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Business Inquiries</h2>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    business@yourstore.com
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    (555) 987-6543
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Monday - Friday, 9am - 5pm EST
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-secondary rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Need Immediate Assistance?</h2>
            <p className="text-muted-foreground mb-6">
              Our live chat support is available during business hours for quick responses to your questions.
            </p>
            <p className="text-sm text-muted-foreground">
              Average response time: &lt; 5 minutes
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;