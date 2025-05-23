
import { useState } from "react";
import Layout from "@/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
};

const initialInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    price: "$1,200.00",
    stock: 15,
    status: "in-stock",
  },
  {
    id: 2,
    name: "Desk Chair",
    category: "Furniture",
    price: "$250.00",
    stock: 8,
    status: "in-stock",
  },
  {
    id: 3,
    name: "Wireless Mouse",
    category: "Electronics",
    price: "$35.00",
    stock: 3,
    status: "low-stock",
  },
  {
    id: 4,
    name: "LED Monitor",
    category: "Electronics",
    price: "$180.00",
    stock: 0,
    status: "out-of-stock",
  },
  {
    id: 5,
    name: "Standing Desk",
    category: "Furniture",
    price: "$450.00",
    stock: 5,
    status: "in-stock",
  },
  {
    id: 6,
    name: "Office Lamp",
    category: "Accessories",
    price: "$45.00",
    stock: 2,
    status: "low-stock",
  },
];

const Inventory = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    stock: 0,
  });

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : value,
    }));
  };

  const getItemStatus = (stock: number): "in-stock" | "low-stock" | "out-of-stock" => {
    if (stock <= 0) return "out-of-stock";
    if (stock <= 3) return "low-stock";
    return "in-stock";
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Error",
        description: "Name and price are required",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...inventory.map((item) => item.id)) + 1;
    const status = getItemStatus(newItem.stock);
    
    setInventory([
      ...inventory,
      { ...newItem, id: newId, status },
    ]);
    
    setIsDialogOpen(false);
    setNewItem({
      name: "",
      category: "",
      price: "",
      stock: 0,
    });

    toast({
      title: "Item added",
      description: `${newItem.name} has been added to inventory`,
    });
  };

  const handleDeleteItem = (id: number) => {
    const itemToDelete = inventory.find((item) => item.id === id);
    setInventory(inventory.filter((item) => item.id !== id));
    
    toast({
      title: "Item deleted",
      description: `${itemToDelete?.name} has been removed from inventory`,
    });
  };

  const handleUpdateStock = (id: number, increment: boolean) => {
    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          const newStock = increment ? item.stock + 1 : Math.max(0, item.stock - 1);
          return {
            ...item,
            stock: newStock,
            status: getItemStatus(newStock),
          };
        }
        return item;
      })
    );
  };

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Inventory</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      }
    >
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleUpdateStock(item.id, false)}
                    >
                      -
                    </Button>
                    <span>{item.stock}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleUpdateStock(item.id, true)}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      item.status === "in-stock"
                        ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                        : item.status === "low-stock"
                        ? "border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                        : "border-red-500 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                    }
                  >
                    {item.status === "in-stock"
                      ? "In Stock"
                      : item.status === "low-stock"
                      ? "Low Stock"
                      : "Out of Stock"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredInventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No inventory items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Enter the details of the new inventory item below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                value={newItem.category}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                value={newItem.price}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="$0.00"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={newItem.stock}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Inventory;
