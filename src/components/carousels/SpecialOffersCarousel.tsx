import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ChevronLeft } from "lucide-react";

interface SpecialOffersCarouselProps {
  products: Product[];
}

export function SpecialOffersCarousel({ products }: SpecialOffersCarouselProps) {
  return (
    <div className="lg:block flex flex-col justify-center items-center lg:rounded-lg overflow-hidden bg-gradient-to-br from-red-600 to-red-500 shadow-lg">
      <a href="/special-offers" className="lg:w-auto w-full lg:h-full flex items-between lg:items-center justify-between flex-row lg:flex-col gap-3 px-5 lg:px-0 pt-5 pb-3 lg:!py-4 hover:opacity-90 transition-opacity">
        <div className="flex flex-row justify-center items-center lg:flex-col gap-2 lg:gap-3">
          <div className="order-2 lg:order-1 w-[108px] h-[20px]">
            <span className="text-white font-bold text-xl">Special Offers</span>
          </div>
          
          <div className="flex gap-[2px] items-center right-0 h-6 order-3 lg:order-2">
            <div className="flex flex-col items-center justify-center bg-white w-[26px] h-[26px] rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center items-center text-neutral-800 text-center w-[20px] h-[20px]">
                52
              </div>
            </div>
            <div className="text-white w-1">:</div>
            <div className="flex flex-col items-center justify-center bg-white w-[26px] h-[26px] rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center items-center text-neutral-800 text-center w-[20px] h-[20px]">
                18
              </div>
            </div>
            <div className="text-white w-1">:</div>
            <div className="flex flex-col items-center justify-center bg-white w-[26px] h-[26px] rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center items-center text-neutral-800 text-center w-[20px] h-[20px]">
                05
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-3 w-6 h-6">
            <div className="bg-white rounded-full p-1 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-red-500 font-bold">%</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center text-white gap-2 group">
          View All
          <ChevronLeft className="w-4 h-4 group-hover:translate-x-[-4px] transition-transform" />
        </div>
      </a>

      <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide w-full pb-5 lg:py-5 lg:pr-0 justify-start relative lg:rounded-lg pr-5 lg:pr-0 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="block cursor-pointer relative bg-white overflow-hidden shrink-0 py-3 px-3 lg:px-3 h-full rounded-lg shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02]"
            style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}
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
          <div className="bg-white flex flex-col items-center justify-center px-8 rounded-lg h-full shadow-sm hover:shadow-md transition-shadow" 
               style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}>
            <a href="/special-offers" className="flex flex-col items-center justify-center group">
              <div className="rounded-full p-2 border-2 border-red-500 group-hover:bg-red-50 transition-colors">
                <ChevronLeft className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-neutral-700 mt-3 group-hover:text-red-500 transition-colors">View All</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}