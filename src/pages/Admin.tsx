import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Upload, 
  FileSpreadsheet, 
  Check, 
  AlertCircle, 
  Truck, 
  Fuel,
  Eye,
  LogOut,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface ExcelRow {
  [key: string]: any;
}

interface PreviewData {
  headers: string[];
  rows: ExcelRow[];
  partnerId?: string;
}

const Admin = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dispatchPreview, setDispatchPreview] = useState<PreviewData | null>(null);
  const [dieselPreview, setDieselPreview] = useState<PreviewData | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("partnerInfo");
    toast({
      title: "Admin Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const parseExcelFile = useCallback((file: File): Promise<PreviewData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length < 2) {
            throw new Error("File must contain at least headers and one row of data");
          }

          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1).map((row, index) => {
            const rowObject: ExcelRow = {};
            headers.forEach((header, headerIndex) => {
              rowObject[header] = row[headerIndex] || '';
            });
            return rowObject;
          });

          // Auto-detect partner ID (assumes first column or "Partner ID" column)
          const partnerId = rows[0]?.['Partner ID'] || rows[0]?.[headers[0]] || 'AUTO_DETECTED';

          resolve({
            headers,
            rows,
            partnerId: String(partnerId)
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleFileUpload = useCallback(async (
    file: File, 
    type: "dispatch" | "diesel"
  ) => {
    try {
      setIsUploading(true);
      setUploadStatus("idle");
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const previewData = await parseExcelFile(file);

      if (type === "dispatch") {
        setDispatchPreview(previewData);
      } else {
        setDieselPreview(previewData);
      }

      setUploadProgress(100);
      setUploadStatus("success");
      
      toast({
        title: "File Parsed Successfully",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} data preview is ready. Review and save when ready.`,
      });

    } catch (error) {
      setUploadStatus("error");
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to parse Excel file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [parseExcelFile, toast]);

  const handleSaveData = useCallback(async (type: "dispatch" | "diesel") => {
    const data = type === "dispatch" ? dispatchPreview : dieselPreview;
    
    if (!data) return;

    try {
      setIsUploading(true);

      // Simulate API call to save data
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Data Saved Successfully",
        description: `${data.rows.length} ${type} records have been saved to the database.`,
      });

      // Clear preview after saving
      if (type === "dispatch") {
        setDispatchPreview(null);
      } else {
        setDieselPreview(null);
      }

    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save data to database",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [dispatchPreview, dieselPreview, toast]);

  const FileUploadCard = ({ 
    type, 
    preview, 
    icon: Icon 
  }: { 
    type: "dispatch" | "diesel";
    preview: PreviewData | null;
    icon: any;
  }) => (
    <Card className="shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="w-5 h-5" />
          <span>Upload {type.charAt(0).toUpperCase() + type.slice(1)} Data</span>
        </CardTitle>
        <CardDescription>
          Upload Excel file containing {type} records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`${type}-upload`}>Select Excel File</Label>
          <Input
            id={`${type}-upload`}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file, type);
              }
            }}
            disabled={isUploading}
            className="mt-2"
          />
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {uploadStatus === "success" && preview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                File parsed successfully! Found {preview.rows.length} records.
                {preview.partnerId && (
                  <Badge variant="secondary" className="ml-2">
                    Partner: {preview.partnerId}
                  </Badge>
                )}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Data Preview</span>
                </h4>
                <Button
                  onClick={() => handleSaveData(type)}
                  size="sm"
                  className="bg-gradient-primary"
                  disabled={isUploading}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save to Database
                </Button>
              </div>

              <div className="border rounded-lg max-h-64 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {preview.headers.map((header) => (
                        <TableHead key={header} className="min-w-24">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.rows.slice(0, 5).map((row, index) => (
                      <TableRow key={index}>
                        {preview.headers.map((header) => (
                          <TableCell key={header} className="text-xs">
                            {String(row[header] || '-')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {preview.rows.length > 5 && (
                  <div className="text-center py-2 text-sm text-muted-foreground border-t">
                    ... and {preview.rows.length - 5} more rows
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {uploadStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to parse Excel file. Please check the file format and try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-mixed rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Archana Transport</h1>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">
            Upload and manage dispatch and diesel data for all partners
          </p>
        </motion.div>

        {/* Upload Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FileUploadCard
              type="dispatch"
              preview={dispatchPreview}
              icon={Truck}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FileUploadCard
              type="diesel"
              preview={dieselPreview}
              icon={Fuel}
            />
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Upload Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Dispatch Data Format</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Partner ID (Column A)</li>
                    <li>• Date (YYYY-MM-DD)</li>
                    <li>• Vehicle Number</li>
                    <li>• In Time (HH:MM)</li>
                    <li>• Out Time (HH:MM)</li>
                    <li>• Quantity (Tons)</li>
                    <li>• Location</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Diesel Data Format</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Partner ID (Column A)</li>
                    <li>• Date (YYYY-MM-DD)</li>
                    <li>• Vehicle Number</li>
                    <li>• Diesel Issued (Litres)</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Partner ID will be automatically detected from the first column. 
                  Ensure all rows in the Excel file belong to the same partner.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;