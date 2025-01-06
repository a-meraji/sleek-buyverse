import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/home/Footer";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Methods</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Standard Shipping (5-7 business days)</li>
              <li>Express Shipping (2-3 business days)</li>
              <li>Next Day Delivery (order before 2 PM)</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Rates</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Free shipping on orders over $50</li>
              <li>Standard Shipping: $5.99</li>
              <li>Express Shipping: $12.99</li>
              <li>Next Day Delivery: $24.99</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
            <p>
              We currently ship to select international destinations. Shipping rates and
              delivery times vary by location.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;