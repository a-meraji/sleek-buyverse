import { Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface SortMenuProps {
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export const SortMenu = ({ setSortOrder }: SortMenuProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
        Sort
        <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setSortOrder('asc')}
                className={`${
                  active ? 'bg-gray-100' : ''
                } block px-4 py-2 text-sm text-gray-900 w-full text-left`}
              >
                Price: Low to High
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setSortOrder('desc')}
                className={`${
                  active ? 'bg-gray-100' : ''
                } block px-4 py-2 text-sm text-gray-900 w-full text-left`}
              >
                Price: High to Low
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};