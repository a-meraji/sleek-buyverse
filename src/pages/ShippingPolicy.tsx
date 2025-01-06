import { Container } from "@/components/ui/container";

const ShippingPolicy = () => {
  return (
    <Container>
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shipping Policy</h1>
          <div className="mt-6 space-y-6 text-gray-600">
            <p>
              We offer reliable shipping services to ensure your products reach you safely and on time.
              Below you'll find detailed information about our shipping policies and procedures.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900">Processing Time</h2>
            <p>
              Orders are typically processed within 1-2 business days after payment confirmation.
              During peak seasons or promotional periods, processing time may be extended.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900">Shipping Methods</h2>
            <p>
              We offer various shipping options to meet your needs:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Standard Shipping (5-7 business days)</li>
              <li>Express Shipping (2-3 business days)</li>
              <li>Next Day Delivery (where available)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900">Shipping Costs</h2>
            <p>
              Shipping costs are calculated based on your location, selected shipping method,
              and order weight. The exact cost will be displayed at checkout before payment.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900">International Shipping</h2>
            <p>
              We ship internationally to select countries. International orders may be subject
              to import duties and taxes, which are the responsibility of the recipient.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900">Order Tracking</h2>
            <p>
              Once your order ships, you'll receive a tracking number via email to monitor
              your package's journey to you.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ShippingPolicy;