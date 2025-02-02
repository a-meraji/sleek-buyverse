import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ChevronLeft } from "lucide-react";

interface SpecialOffersCarouselProps {
  products: Product[];
}

export function SpecialOffersCarousel({ products }: SpecialOffersCarouselProps) {
  return (
    <div className="lg:block flex flex-col justify-center items-center lg:rounded-lg overflow-hidden bg-gradient-to-br from-red-600 to-red-500">
      <a href="/special-offers" className="lg:w-auto w-full lg:h-full flex items-between lg:items-center justify-between flex-row lg:flex-col gap-3 px-5 lg:px-0 pt-5 pb-3 lg:!py-0">
        <div className="flex flex-row justify-center items-center lg:flex-col gap-2 lg:gap-3">
          <div className="order-2 lg:order-1 w-[108px] h-[20px]">
            <span className="text-white font-bold text-xl">Special Offers</span>
          </div>
          
          <div className="flex gap-[2px] items-center right-0 h-6 order-3 lg:order-2">
            <div className="flex flex-col items-center justify-center bg-white w-[26px] h-[26px] rounded-sm">
              <div className="flex justify-center items-center text-neutral-800 text-center w-[20px] h-[20px]">
                52
              </div>
            </div>
            <div className="text-white w-1">:</div>
            <div className="flex flex-col items-center justify-center bg-white w-[26px] h-[26px] rounded-sm">
              <div className="flex justify-center items-center text-neutral-800 text-center w-[20px] h-[20px]">
                18
              </div>
            </div>
            <div className="text-white w-1">:</div>
            <div className="flex flex-col items-center justify-center bg-white w-[26px] h-[26px] rounded-sm">
              <div className="flex justify-center items-center text-neutral-800 text-center w-[20px] h-[20px]">
                05
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-3 w-6 h-6">
            <div className="bg-white rounded-full p-1">
              <span className="text-red-500 font-bold">%</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center text-white gap-2">
          View All
          <ChevronLeft className="w-4 h-4" />
        </div>
      </a>

      <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide w-full pb-5 lg:py-5 lg:pr-0 justify-stretch relative lg:rounded-lg pr-5 lg:pr-0">
        {products.map((product) => (
          <div
            key={product.id}
            className="block cursor-pointer relative bg-white overflow-hidden grow py-2 px-2 lg:px-2 h-full shrink-0 ml-[2px] !h-[auto] lg:!h-full rounded-r-md"
            style={{ width: '130px', minWidth: '130px', maxWidth: '130px' }}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              image={product.image_url}
              product_variants={product.product_variants}
              discount={product.discount}
              brand={product.brand}
            />
          </div>
        ))}
        
        <div className="pl-5 lg:h-full">
          <div className="bg-white flex flex-col items-center justify-center px-8 rounded-l-md h-full" style={{ width: '130px', minWidth: '130px', maxWidth: '130px' }}>
            <a href="/special-offers" className="flex flex-col items-center justify-center">
              <div className="rounded-full p-2 border-2 border-red-500">
                <ChevronLeft className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-neutral-700 mt-3">View All</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}