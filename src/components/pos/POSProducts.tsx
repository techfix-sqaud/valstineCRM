
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";
import { Product } from "@/pages/POS";

interface POSProductsProps {
  searchTerm: string;
  onAddToCart: (product: Product, quantity?: number) => void;
}

const sampleProducts: Product[] = [
  { id: "1", name: "Laptop Dell XPS", price: 1299.99, category: "Electronics", stock: 5, barcode: "123456789" },
  { id: "2", name: "Wireless Mouse", price: 29.99, category: "Electronics", stock: 15 },
  { id: "3", name: "Office Chair", price: 249.99, category: "Furniture", stock: 8 },
  { id: "4", name: "Coffee Mug", price: 12.99, category: "Accessories", stock: 25 },
  { id: "5", name: "Notebook", price: 5.99, category: "Stationery", stock: 50 },
  { id: "6", name: "Desk Lamp", price: 39.99, category: "Furniture", stock: 12 },
  { id: "7", name: "Smartphone", price: 699.99, category: "Electronics", stock: 3 },
  { id: "8", name: "Headphones", price: 79.99, category: "Electronics", stock: 20 },
];

const categories = ["All", "Electronics", "Furniture", "Accessories", "Stationery"];

export const POSProducts = ({ searchTerm, onAddToCart }: POSProductsProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
        {filteredProducts.map(product => (
          <Card 
            key={product.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onAddToCart(product)}
          >
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${product.price}</span>
                  <Badge variant={product.stock > 5 ? "secondary" : "destructive"} className="text-xs">
                    {product.stock} left
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
};
