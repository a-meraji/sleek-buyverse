import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export const SearchBar = ({ isExpanded, setIsExpanded }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsExpanded(false);
      setSearchQuery(""); // Clear search after submitting
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={`${
        isExpanded ? 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4' : 'hidden md:flex'
      } items-center gap-2`}
    >
      <Input
        type="search"
        placeholder="Search products..."
        className={`${isExpanded ? 'w-full max-w-md' : 'w-[300px]'}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isExpanded && (
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => setIsExpanded(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
      <Button type="submit" variant="ghost" size="icon">
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
};