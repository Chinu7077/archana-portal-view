import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Download, 
  Truck, 
  Fuel, 
  Calendar, 
  TrendingUp,
  MapPin,
  Clock,
  LogOut,
  Package,
  FileX
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface DispatchData {
  date: string;
  vehicleNo: string;
  inTime: string;
  outTime: string;
  quantity: number;
  location: string;
}

interface DieselData {
  date: string;
  vehicleNo: string;
  dieselIssued: number;
}

interface MaterialData {
  date: string;
  vehicleNo: string;
  materialType: string;
  quantity: number;
  unit: string;
}

const Dashboard = () => {
  const { user, signOut, userRole, isAdmin, isPartner } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dateFilter, setDateFilter] = useState("1-15");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dispatch");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data with DD/MM/YYYY format
  const allDispatchData: DispatchData[] = [
    { date: "15/01/2025", vehicleNo: "OD-05-1234", inTime: "08:30", outTime: "17:45", quantity: 25.5, location: "Bhubaneswar" },
    { date: "14/01/2025", vehicleNo: "OD-05-5678", inTime: "09:15", outTime: "18:20", quantity: 30.2, location: "Cuttack" },
    { date: "13/01/2025", vehicleNo: "OD-05-9012", inTime: "07:45", outTime: "16:30", quantity: 28.7, location: "Rourkela" },
    { date: "12/01/2025", vehicleNo: "OD-05-3456", inTime: "10:00", outTime: "19:15", quantity: 22.8, location: "Sambalpur" },
    { date: "18/01/2025", vehicleNo: "OD-05-7890", inTime: "09:00", outTime: "18:00", quantity: 35.0, location: "Berhampur" },
    { date: "25/01/2025", vehicleNo: "OD-05-1111", inTime: "08:15", outTime: "17:30", quantity: 28.5, location: "Angul" },
  ];

  const allDieselData: DieselData[] = [
    { date: "15/01/2025", vehicleNo: "OD-05-1234", dieselIssued: 150 },
    { date: "14/01/2025", vehicleNo: "OD-05-5678", dieselIssued: 175 },
    { date: "13/01/2025", vehicleNo: "OD-05-9012", dieselIssued: 160 },
    { date: "12/01/2025", vehicleNo: "OD-05-3456", dieselIssued: 140 },
    { date: "18/01/2025", vehicleNo: "OD-05-7890", dieselIssued: 180 },
    { date: "25/01/2025", vehicleNo: "OD-05-1111", dieselIssued: 165 },
  ];

  const allMaterialData: MaterialData[] = [
    { date: "15/01/2025", vehicleNo: "OD-05-1234", materialType: "Iron Ore", quantity: 25.5, unit: "Tons" },
    { date: "14/01/2025", vehicleNo: "OD-05-5678", materialType: "Coal", quantity: 30.2, unit: "Tons" },
    { date: "13/01/2025", vehicleNo: "OD-05-9012", materialType: "Limestone", quantity: 28.7, unit: "Tons" },
    { date: "12/01/2025", vehicleNo: "OD-05-3456", materialType: "Iron Ore", quantity: 22.8, unit: "Tons" },
    { date: "18/01/2025", vehicleNo: "OD-05-7890", materialType: "Coal", quantity: 35.0, unit: "Tons" },
    { date: "25/01/2025", vehicleNo: "OD-05-1111", materialType: "Bauxite", quantity: 28.5, unit: "Tons" },
  ];

  // Filter data based on selected month, year, and date range
  const filterDataByDate = (data: any[]) => {
    return data.filter(item => {
      const [day, month, year] = item.date.split('/').map(Number);
      const itemDate = new Date(year, month - 1, day);
      const selectedDate = new Date(selectedYear, selectedMonth - 1, 1);
      
      // Check if item is in selected month and year
      if (itemDate.getFullYear() !== selectedYear || itemDate.getMonth() !== selectedMonth - 1) {
        return false;
      }
      
      // Apply date range filter
      if (dateFilter === "1-15") {
        return day >= 1 && day <= 15;
      } else if (dateFilter === "16-31") {
        return day >= 16 && day <= 31;
      }
      
      return true; // "all" case
    });
  };

  const filteredDispatchData = filterDataByDate(allDispatchData);
  const filteredDieselData = filterDataByDate(allDieselData);
  const filteredMaterialData = filterDataByDate(allMaterialData);

  const totalUnload = filteredDispatchData.reduce((sum, item) => sum + item.quantity, 0);
  const totalDiesel = filteredDieselData.reduce((sum, item) => sum + item.dieselIssued, 0);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleDownloadExcel = () => {
    toast({
      title: "Download Started",
      description: "Excel file with dispatch and diesel data is being prepared...",
    });
    // In real implementation, trigger Excel download
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Archana Transport</h1>
                  <p className="text-xs text-muted-foreground">Partner Portal</p>
                </div>
              </div>
            </div>
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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.email || 'Partner'}
          </h2>
          <p className="text-muted-foreground">Here's your transportation dashboard overview</p>
        </motion.div>

        {/* Enhanced Date Filter & Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Month Filter */}
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">June</SelectItem>
                <SelectItem value="7">July</SelectItem>
                <SelectItem value="8">August</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-15">1st to 15th</SelectItem>
                <SelectItem value="16-31">16th to 30/31</SelectItem>
                <SelectItem value="all">Full Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleDownloadExcel}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 animate-glow-pulse ml-auto"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Unload</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalUnload.toFixed(1)} Tons</div>
              <Badge variant="secondary" className="mt-2">
                {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} 
                {dateFilter !== 'all' && ` (${dateFilter})`}
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Diesel</CardTitle>
              <Fuel className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{totalDiesel} Ltr</div>
              <Badge variant="secondary" className="mt-2">
                {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} 
                {dateFilter !== 'all' && ` (${dateFilter})`}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Tables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Transportation Data</CardTitle>
              <CardDescription>
                View your dispatch and diesel consumption records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dispatch" className="flex items-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span>Dispatch Data</span>
                  </TabsTrigger>
                  <TabsTrigger value="material" className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Material</span>
                  </TabsTrigger>
                  <TabsTrigger value="diesel" className="flex items-center space-x-2">
                    <Fuel className="w-4 h-4" />
                    <span>Diesel Data</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dispatch" className="mt-6">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : filteredDispatchData.length === 0 ? (
                    <div className="text-center py-12">
                      <FileX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No Records Found</h3>
                      <p className="text-sm text-muted-foreground">
                        No dispatch data available for the selected period.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Vehicle No</TableHead>
                            <TableHead className="hidden sm:table-cell">In Time</TableHead>
                            <TableHead className="hidden sm:table-cell">Out Time</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Location</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDispatchData.map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="font-medium">{item.date}</TableCell>
                              <TableCell>{item.vehicleNo}</TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span>{item.inTime}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span>{item.outTime}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-mono">
                                  {item.quantity} T
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <span>{item.location}</span>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="material" className="mt-6">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : filteredMaterialData.length === 0 ? (
                    <div className="text-center py-12">
                      <FileX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No Records Found</h3>
                      <p className="text-sm text-muted-foreground">
                        No material data available for the selected period.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Vehicle No</TableHead>
                            <TableHead>Material Type</TableHead>
                            <TableHead>Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMaterialData.map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="font-medium">{item.date}</TableCell>
                              <TableCell>{item.vehicleNo}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {item.materialType}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-mono">
                                  {item.quantity} {item.unit}
                                </Badge>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="diesel" className="mt-6">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : filteredDieselData.length === 0 ? (
                    <div className="text-center py-12">
                      <FileX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No Records Found</h3>
                      <p className="text-sm text-muted-foreground">
                        No diesel data available for the selected period.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Vehicle No</TableHead>
                            <TableHead>Diesel Issued</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDieselData.map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="font-medium">{item.date}</TableCell>
                              <TableCell>{item.vehicleNo}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-mono">
                                  {item.dieselIssued} L
                                </Badge>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;