import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/home/Footer";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">
            We're here to help! Get in touch with us through any of the following methods:
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Customer Support</h2>
              <p>Email: support@yourstore.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Hours: Monday - Friday, 9am - 5pm EST</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Business Inquiries</h2>
              <p>Email: business@yourstore.com</p>
              <p>Phone: (555) 987-6543</p>
              <p>Hours: Monday - Friday, 9am - 5pm EST</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;