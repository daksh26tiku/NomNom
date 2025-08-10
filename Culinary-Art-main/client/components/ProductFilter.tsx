"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductFiltersProps {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export default function ProductFilter({
  categories,
  priceRange,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get filter values from URL
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const inStock = searchParams.get("inStock") === "true";
  const minPrice = Number(searchParams.get("minPrice") || priceRange.min);
  const maxPrice = Number(searchParams.get("maxPrice") || priceRange.max);

  // Local state for UI
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [sortOption, setSortOption] = useState(sort);
  const [showInStock, setShowInStock] = useState(inStock);
  const [priceRangeValue, setPriceRangeValue] = useState<[number, number]>([
    minPrice || priceRange.min,
    maxPrice || priceRange.max,
  ]);

  // Update local state when URL params change
  useEffect(() => {
    setSelectedCategory(category);
    setSortOption(sort);
    setShowInStock(inStock);
    setPriceRangeValue([
      minPrice || priceRange.min,
      maxPrice || priceRange.max,
    ]);
  }, [
    category,
    sort,
    inStock,
    minPrice,
    maxPrice,
    priceRange.min,
    priceRange.max,
  ]);

  // Function to update URL with filters
  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("search");

    // Update params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    if (params.has("page")) {
      params.set("page", "1");
    }

    // Update URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`);
  };

  // Active filter count
  const activeFilterCount = [
    selectedCategory !== "",
    sortOption !== "",
    showInStock,
    priceRangeValue[0] > priceRange.min || priceRangeValue[1] < priceRange.max,
  ].filter(Boolean).length;

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateFilters({ category: value || null });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    updateFilters({ sort: value || null });
  };

  // Handle in-stock change
  const handleInStockChange = (checked: boolean) => {
    setShowInStock(checked);
    updateFilters({ inStock: checked ? "true" : null });
  };

  // Handle price range change with debounce
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRangeValue(value);
  };

  // Update URL when price range slider stops
  const handlePriceRangeCommit = (value: [number, number]) => {
    const [min, max] = value;
    const updates: Record<string, string | null> = {};

    if (min !== priceRange.min) {
      updates.minPrice = min.toString();
    } else {
      updates.minPrice = null;
    }

    if (max !== priceRange.max) {
      updates.maxPrice = max.toString();
    } else {
      updates.maxPrice = null;
    }

    updateFilters(updates);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("");
    setSortOption("");
    setShowInStock(false);
    setPriceRangeValue([priceRange.min, priceRange.max]);

    router.push(pathname);
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Category: {selectedCategory}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleCategoryChange("")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove filter</span>
                    </Button>
                  </Badge>
                )}
                {sortOption && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Sort: {sortOption.replace(/-/g, " ")}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleSortChange("")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove filter</span>
                    </Button>
                  </Badge>
                )}
                {showInStock && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    In Stock Only
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleInStockChange(false)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove filter</span>
                    </Button>
                  </Badge>
                )}
                {(priceRangeValue[0] > priceRange.min ||
                  priceRangeValue[1] < priceRange.max) && (
                  <Badge variant="outline" className="flex items-center gap-1">
                                Price: ₹ {priceRangeValue[0]} - ₹{" "}
            {priceRangeValue[1]}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => {
                        setPriceRangeValue([priceRange.min, priceRange.max]);
                        updateFilters({ minPrice: null, maxPrice: null });
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove filter</span>
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Sort Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Sort By</h4>
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="name-a-z">Name: A to Z</SelectItem>
              <SelectItem value="name-z-a">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Category</h4>
          <RadioGroup
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="category-all" />
                <Label
                  htmlFor="category-all"
                  className="text-sm font-normal cursor-pointer"
                >
                  All Categories
                </Label>
              </div>
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={category}
                    id={`category-${category}`}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Availability */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Availability</h4>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={showInStock}
              onCheckedChange={(checked) => handleInStockChange(!!checked)}
            />
            <Label
              htmlFor="in-stock"
              className="text-sm font-normal cursor-pointer"
            >
              In Stock Only
            </Label>
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Price Range</h4>
            <span className="text-sm text-muted-foreground">
              ₹ {priceRangeValue[0]} - ₹ {priceRangeValue[1]}
            </span>
          </div>
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            value={priceRangeValue}
            onValueChange={handlePriceRangeChange}
            onValueCommit={handlePriceRangeCommit}
            className="py-4"
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              ₹ {priceRange.min}
            </div>
                          <div className="text-sm text-muted-foreground">
                ₹ {priceRange.max}
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
