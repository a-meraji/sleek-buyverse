import { Truck, Shield, RotateCcw, Clock } from "lucide-react";

const policies = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100"
  },
  {
    icon: Shield,
    title: "2 Year Warranty",
    description: "Full coverage"
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy"
  },
  {
    icon: Clock,
    title: "Support 24/7",
    description: "Dedicated support"
  }
];

export function WatchPolicies() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {policies.map((policy) => (
            <div
              key={policy.title}
              className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm"
            >
              <policy.icon className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">{policy.title}</h3>
              <p className="text-muted-foreground">{policy.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}