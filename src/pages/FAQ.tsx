import { Navbar } from "@/components/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How long does shipping take?</AccordionTrigger>
            <AccordionContent>
              Standard shipping typically takes 5-7 business days. Express shipping is
              available for 2-3 business days delivery.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What is your return policy?</AccordionTrigger>
            <AccordionContent>
              We offer a 30-day return policy for unused items in their original
              packaging with tags attached.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
            <AccordionContent>
              Yes, we ship to select international destinations. Shipping rates and
              delivery times vary by location.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How can I track my order?</AccordionTrigger>
            <AccordionContent>
              Once your order ships, you'll receive a tracking number via email that you
              can use to monitor your delivery status.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
};

export default FAQ;