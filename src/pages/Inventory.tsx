
import { useState } from "react";
import { Plus, Search, Filter, Package2, DollarSign, AlertCircle, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/hooks/useLanguage";
import { BulkUpload } from "@/components/bulk-upload";
import Layout from "@/components/layout";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export default function Inventory() {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([
    { id: "1", name: "Product A", sku: "SKU001", category: "Electronics", stock: 25, price: 99.99, status: "in-stock" },
    { id: "2", name: "Product B", sku: "SKU002", category: "Clothing", stock: 5, price: 49.99, status: "low-stock" },
    { id: "3", name: "Product C", sku: "SKU003", category: "Books", stock: 0, price: 19.99, status: "out-of-stock" },
    { id: "4", name: "Product D", sku: "SKU004", category: "Electronics", stock: 50, price: 199.99, status: "in-stock" },
  ]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      'in-stock': 'default',
      'low-stock': 'destructive',
      'out-of-stock': 'secondary'
    };
    return variants[status as keyof typeof variants] || 'default';
  };

  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = items.filter(item => item.status === 'out-of-stock').length;
  const totalValue = items.reduce((sum, item) => sum + (item.stock * item.price), 0);

  const handleBulkUploadItems = (data: any[]) => {
    const newItems: InventoryItem[] = data.map((row, index) => ({
      id: `bulk_${Date.now()}_${index}`,
      name: row.name || `Item ${index + 1}`,
      sku: row.sku || `SKU${String(Date.now()).slice(-6)}${index}`,
      category: row.category || 'General',
      stock: parseInt(row.stock) || 0,
      price: parseFloat(row.price) || 0,
      status: parseInt(row.stock) > 10 ? 'in-stock' : parseInt(row.stock) > 0 ? 'low-stock' : 'out-of-stock'
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Name', 'SKU', 'Category', 'Stock', 'Price', 'Status'].join(','),
      ...filteredItems.map(item => 
        [item.name, item.sku, item.category, item.stock, item.price, item.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-3xl font-bold">{t('inventory') || 'Inventory'}</h1>
            <p className="text-muted-foreground">Manage your products and stock levels</p>
          </div>
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BulkUpload type="items" onUpload={handleBulkUploadItems} />
            <Button onClick={exportToExcel} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{lowStockItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={isRTL ? 'pr-10' : 'pl-10'}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className={isRTL ? 'text-left' : 'text-right'}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(item.status) as any}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
