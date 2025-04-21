"use client"

import { getOrder, updateOrder, addOrder, deleteOrder } from "@/app/actions/order"
import { getOrderDetails, addOrderDetails } from "@/app/actions/order_details"
import { getCustomer } from "@/app/actions/customer"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, MoreHorizontal, Plus, Search, Trash, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { orders, type Order, type OrderStatus, medicines, customers } from "@/lib/data"
import { Textarea } from "@/components/ui/textarea"

// set type (Draft order object)
interface Orders {
  order_id: string;
  customer_id: string;
  employee_id: string;
  order_date: Date;
  total_price: Float16Array;
}

interface OrderDetails {
  order_detail_id: string;
  order_id: string;
  medicine_id: string;
  quantity: Int16Array;
  payment: string;
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orderData, setOrderData] = useState<Orders[]>([]);
  const [orderDetailData, setOrderDetailData] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false); // State for add dialog open/close
  const [isEditDialogOpen, setEditDialogOpen] = useState(false); // State for edit dialog open/close

  const [newMedicineID, setNewMedicineID] = useState(""); // edit to other data 
  const [newPayment, setPayment] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newOrderDate, setNewOrderDate] = useState("");
  const [newCustomerID, setNewCustomerID] = useState("");
  const [newEmployeeID, setNewEmployeeID] = useState("");
  const [newTotalPrice, setNewTotalPrice] = useState("");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
// add new
  const [statusFilter, setStatusFilter] = useState("");

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [orderCounts, setOrderCounts] = useState<Array<{ customer_id: string; order_count: number }>>([]);

  // Filter orders
  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "all" || order.status === statusFilter) &&
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const orderFromDb = await getOrder();
        const orderDetailsFromDB = await getOrderDetails();
        // const orderCountsFromDb = await getOrderCount(orderFromDb.order_id);

        if (orderFromDb && orderDetailsFromDB) { // && orderCountsFromDb
          setOrderData(orderFromDb as Orders[]);
          // setOrderCounts(orderCountsFromDb);
        } else {
          setError(new Error("Failed to fetch data from database."));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshOrderList = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderFromDb = await getOrder();
      const orderDetailFromDB = await getOrderDetails();
      // const orderCountsFromDb = await getOrderCountsByCustomer();

      if (orderFromDb && orderDetailFromDB) {
        setOrderData(orderFromDb as Orders[]);
        setOrderDetailData(orderDetailFromDB as OrderDetails[]);
        // setOrderCounts(orderCountsFromDb);
      } else {
        setError(new Error("Failed to fetch data from database."));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  }

  const handleAddOrderDetails = async () => {
    setSubmissionError(null);
    if (!newMedicineID || !newQuantity || !newPayment) {
      setSubmissionError("Please fill in all required fields.");
      return;
    }

    const orderData = {
      customer_id: newCustomerID,    
      employee_id: newEmployeeID,
      order_date: newOrderDate,
      total_price: newTotalPrice,
      order_id: generateOrderID(),
    };

    const orderDetail = {
      medicine_id: newMedicineID,
      quantity: newQuantity,
      payment: newPayment,
      order_id: generateOrderID(),
      order_detail_id: generateOrderDetailID(),
    }

    try {
      const result = await addOrder(orderData);
      if (result.error) {
        setSubmissionError(`Failed to add customer: ${result.error.message || 'Unknown error'}`);
      } else {
        setDialogOpen(false);
        setNewOrderDate("");
        setNewCustomerID("");
        setNewEmployeeID("");
        setNewTotalPrice("");
        refreshOrderList();
      }
    } catch (err) {
      setSubmissionError("An unexpected error occurred while adding order.");
    }

    try {
      const result = await addOrderDetails(orderDetailData);
      if (result.error) {
        setSubmissionError(`Failed to add customer: ${result.error.message || 'Unknown error'}`);
      } else {
        setDialogOpen(false);
        setNewTotalPrice("");
        setNewMedicineID("");
        setNewQuantity("");
        refreshOrderList();
      }
    } catch (err) {
      setSubmissionError("An unexpected error occurred while adding order.");
    }
  };

  const generateOrderID = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateOrderDetailID = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const filteredCustomers = orderData.filter(
    (order) =>
      `${customer.firstname} ${customer.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getOrderCount = (order_id: string) => {
    const count = orderCounts.find(item => item.customer_id === order_id)?.order_count || 0;
    return count;
  };

  const handleDeleteCustomer = async (order_id: string) => {
    setDeleteError(null);
    try {
      const result = await deleteOrder(order_id);
      if (result.error) {
        setDeleteError(`Failed to delete order: ${result.error.message || 'Unknown error'}`);
        console.error("Delete failed:", result.error);
      } else {
        refreshOrderList();
        console.log("Order deleted successfully");
      }
    } catch (err) {
      setDeleteError("An unexpected error occurred while deleting the order.");
      console.error("Unexpected delete error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Enter the details to create a new customer order.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customer">Customer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Order Items</Label>
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-5">Medicine</div>
                    <div className="col-span-3">Price</div>
                    <div className="col-span-3">Quantity</div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center mb-2">
                    <div className="col-span-5">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select medicine" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicines.map((medicine) => (
                            <SelectItem key={medicine.id} value={medicine.id}>
                              {medicine.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input type="text" value="$5.99" disabled />
                    </div>
                    <div className="col-span-3">
                      <Input type="number" min="1" defaultValue="1" />
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="icon">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="payment">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Enter any additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.items.length}</TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{order.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedOrder(order)
                              setViewOrderDetails(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={viewOrderDetails} onOpenChange={setViewOrderDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>{selectedOrder && `Order ID: ${selectedOrder.id}`}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Customer Information</h3>
                  <p>{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">ID: {selectedOrder.customerId}</p>
                </div>
                <div>
                  <h3 className="font-medium">Order Information</h3>
                  <p>Date: {selectedOrder.date}</p>
                  <p>
                    Status:{" "}
                    <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                  </p>
                  <p>Payment: {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medicine</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.medicineName}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Items: {selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Subtotal: ${selectedOrder.total.toFixed(2)}</p>
                  <p className="text-lg font-bold">Total: ${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOrderDetails(false)}>
              Close
            </Button>
            {selectedOrder && selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && (
              <Button>Update Status</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

