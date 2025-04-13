"use client"

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Edit, MoreHorizontal, Plus, Search, ShoppingBag, Trash, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAllCustomers, addCustomer, deleteCustomer, updateCustomer } from "@/actions/customers"; // Import addCustomer and updateCustomer
import { getOrderCountsByCustomer } from "@/actions/orders"; // Import the new server action

// Define type for customer data
interface Customer {
  customer_id: string;
  firstname: string;
  lastname: string;
  phone: string | null;
  email: string;
  address: string;
  dateRegistered?: string;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false); // State for add dialog open/close
  const [isEditDialogOpen, setEditDialogOpen] = useState(false); // State for edit dialog open/close
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null); // State to hold the customer being edited

  const [newCustomerFirstName, setNewCustomerFirstName] = useState("");
  const [newCustomerLastName, setNewCustomerLastName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const [editCustomerFirstName, setEditCustomerFirstName] = useState("");
  const [editCustomerLastName, setEditCustomerLastName] = useState("");
  const [editCustomerEmail, setEditCustomerEmail] = useState("");
  const [editCustomerPhone, setEditCustomerPhone] = useState("");
  const [editCustomerAddress, setEditCustomerAddress] = useState("");
  const [editSubmissionError, setEditSubmissionError] = useState<string | null>(null);


  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [orderCounts, setOrderCounts] = useState<Array<{ customer_id: string; order_count: number }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const customersFromDb = await getAllCustomers();
        const orderCountsFromDb = await getOrderCountsByCustomer();

        if (customersFromDb && orderCountsFromDb) {
          setCustomersData(customersFromDb as Customer[]);
          setOrderCounts(orderCountsFromDb);
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

  const refreshCustomerList = async () => {
    setLoading(true);
    setError(null);
    try {
      const customersFromDb = await getAllCustomers();
      const orderCountsFromDb = await getOrderCountsByCustomer();

      if (customersFromDb && orderCountsFromDb) {
        setCustomersData(customersFromDb as Customer[]);
        setOrderCounts(orderCountsFromDb);
      } else {
        setError(new Error("Failed to fetch data from database."));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  }

  const handleAddCustomer = async () => {
    setSubmissionError(null);
    if (!newCustomerFirstName || !newCustomerLastName || !newCustomerEmail || !newCustomerAddress) {
      setSubmissionError("Please fill in all required fields.");
      return;
    }

    const customerData = {
      firstname: newCustomerFirstName,
      lastname: newCustomerLastName,
      email: newCustomerEmail,
      phone: newCustomerPhone || null,
      address: newCustomerAddress,
      customer_id: generateCustomerID(),
    };

    try {
      const result = await addCustomer(customerData);
      if (result.error) {
        setSubmissionError(`Failed to add customer: ${result.error.message || 'Unknown error'}`);
      } else {
        setDialogOpen(false);
        setNewCustomerFirstName("");
        setNewCustomerLastName("");
        setNewCustomerEmail("");
        setNewCustomerPhone("");
        setNewCustomerAddress("");
        refreshCustomerList();
      }
    } catch (err) {
      setSubmissionError("An unexpected error occurred while adding customer.");
    }
  };

  const handleEditCustomer = async () => {
    setEditSubmissionError(null);

    if (!editCustomerFirstName || !editCustomerLastName || !editCustomerEmail || !editCustomerAddress) {
      setEditSubmissionError("Please fill in all required fields.");
      return;
    }

    if (!editingCustomer) {
      setEditSubmissionError("No customer selected for editing.");
      return;
    }

    const customerData = {
      customer_id: editingCustomer.customer_id,
      firstname: editCustomerFirstName,
      lastname: editCustomerLastName,
      email: editCustomerEmail,
      phone: editCustomerPhone || null,
      address: editCustomerAddress,
    };

    try {
      const result = await updateCustomer(customerData);
      if (result.error) {
        setEditSubmissionError(`Failed to update customer: ${result.error.message || 'Unknown error'}`);
      } else {
        setEditDialogOpen(false);
        setEditingCustomer(null);
        refreshCustomerList();
      }
    } catch (err) {
      setEditSubmissionError("An unexpected error occurred while updating customer.");
    }
  };


  const generateCustomerID = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };


  const filteredCustomers = customersData.filter(
    (customer) =>
      `${customer.firstname} ${customer.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getOrderCount = (customerId: string) => {
    const count = orderCounts.find(item => item.customer_id === customerId)?.order_count || 0;
    return count;
  };

  const handleDeleteCustomer = async (customerId: string) => {
    setDeleteError(null);
    try {
      const result = await deleteCustomer(customerId);
      if (result.error) {
        setDeleteError(`Failed to delete customer: ${result.error.message || 'Unknown error'}`);
        console.error("Delete failed:", result.error);
      } else {
        refreshCustomerList();
        console.log("Customer deleted successfully");
      }
    } catch (err) {
      setDeleteError("An unexpected error occurred while deleting the customer.");
      console.error("Unexpected delete error:", err);
    }
  };


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return <div>Loading customers...</div>;
  }

  if (error) {
    return <div>Error fetching customers: {error.message}</div>;
  }


  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Enter the details of the new customer to add to your database.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {submissionError && <p className="text-red-500">{submissionError}</p>}
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={newCustomerFirstName}
                  onChange={(e) => setNewCustomerFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={newCustomerLastName}
                  onChange={(e) => setNewCustomerLastName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter address"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCustomer}>Save Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            {/* Trigger is no longer needed here, dialog is opened programmatically */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>Edit the details of the customer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {editSubmissionError && <p className="text-red-500">{editSubmissionError}</p>}
              <div className="grid gap-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  placeholder="Enter first name"
                  value={editCustomerFirstName}
                  onChange={(e) => setEditCustomerFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  placeholder="Enter last name"
                  value={editCustomerLastName}
                  onChange={(e) => setEditCustomerLastName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={editCustomerEmail}
                    onChange={(e) => setEditCustomerEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPhone">Phone (Optional)</Label>
                  <Input
                    id="editPhone"
                    placeholder="Enter phone number"
                    value={editCustomerPhone}
                    onChange={(e) => setEditCustomerPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editAddress">Address</Label>
                <Input
                  id="editAddress"
                  placeholder="Enter address"
                  value={editCustomerAddress}
                  onChange={(e) => setEditCustomerAddress(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditCustomer}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4">
        {/* ... rest of your component (search, tabs, table/card view) ... */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="card">Card View</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Address</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.customer_id}>
                        <TableCell className="font-medium">{customer.customer_id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(`${customer.firstname} ${customer.lastname}`)}</AvatarFallback>
                            </Avatar>
                            {`${customer.firstname} ${customer.lastname}`}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{customer.phone}</TableCell>
                        <TableCell className="hidden lg:table-cell">{customer.address}</TableCell>
                        <TableCell>{getOrderCount(customer.customer_id)}</TableCell>
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
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                View Orders
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingCustomer(customer);
                                  setEditCustomerFirstName(customer.firstname);
                                  setEditCustomerLastName(customer.lastname);
                                  setEditCustomerEmail(customer.email);
                                  setEditCustomerPhone(customer.phone || "");
                                  setEditCustomerAddress(customer.address);
                                  setEditDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCustomer(customer.customer_id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
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
          </TabsContent>
          <TabsContent value="card">
            {/* ... Card View Tab Content (no changes needed for edit functionality in card view itself) ... */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}