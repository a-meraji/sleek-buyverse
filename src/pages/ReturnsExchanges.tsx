import { Navbar } from "@/components/Navbar";

const ReturnsExchanges = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Returns & Exchanges</h1>
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
            <p>
              We accept returns within 30 days of purchase. Items must be unused and in
              their original packaging with all tags attached.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Exchange Process</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact our customer service team</li>
              <li>Receive a return authorization number</li>
              <li>Pack your item securely</li>
              <li>Ship to our returns center</li>
              <li>Receive your exchange item</li>
            </ol>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Refund Information</h2>
            <p>
              Refunds will be processed to the original payment method within 5-7
              business days of receiving your return.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ReturnsExchanges;