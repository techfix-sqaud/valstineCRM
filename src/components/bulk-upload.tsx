
import { useState } from "react";
import { Upload, Download, FileText, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BulkUploadProps {
  type: 'users' | 'items';
  onUpload: (data: any[]) => void;
}

export function BulkUpload({ type, onUpload }: BulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const processCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }

    return data;
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const data = processCSV(text);
      
      // Validate data based on type
      if (type === 'users') {
        const requiredFields = ['name', 'email'];
        const isValid = data.every(row => 
          requiredFields.every(field => row[field] && row[field].trim())
        );
        if (!isValid) {
          throw new Error('CSV must contain name and email columns');
        }
      } else if (type === 'items') {
        const requiredFields = ['name', 'price'];
        const isValid = data.every(row => 
          requiredFields.every(field => row[field] && row[field].trim())
        );
        if (!isValid) {
          throw new Error('CSV must contain name and price columns');
        }
      }

      onUpload(data);
      toast({
        title: "Upload Successful",
        description: `${data.length} ${type} uploaded successfully.`,
      });
      setFile(null);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    let csvContent = '';
    if (type === 'users') {
      csvContent = 'name,email,phone,company,role\nJohn Doe,john@example.com,+1234567890,Acme Corp,Manager\n';
    } else if (type === 'items') {
      csvContent = 'name,price,category,description,stock\nProduct 1,99.99,Electronics,Sample product,50\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const icon = type === 'users' ? Users : Package;
  const IconComponent = icon;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Bulk Upload {type === 'users' ? 'Users' : 'Items'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            Bulk Upload {type === 'users' ? 'Users' : 'Items'}
          </DialogTitle>
          <DialogDescription>
            Upload multiple {type} at once using a CSV file.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>
            
            {file && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </TabsContent>
          
          <TabsContent value="template" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Download Template</CardTitle>
                <CardDescription>
                  Download a sample CSV file to see the required format.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={downloadTemplate} variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download {type === 'users' ? 'Users' : 'Items'} Template
                </Button>
              </CardContent>
            </Card>
            
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Required columns:</p>
              <ul className="list-disc list-inside space-y-1">
                {type === 'users' ? (
                  <>
                    <li>name (required)</li>
                    <li>email (required)</li>
                    <li>phone (optional)</li>
                    <li>company (optional)</li>
                    <li>role (optional)</li>
                  </>
                ) : (
                  <>
                    <li>name (required)</li>
                    <li>price (required)</li>
                    <li>category (optional)</li>
                    <li>description (optional)</li>
                    <li>stock (optional)</li>
                  </>
                )}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
