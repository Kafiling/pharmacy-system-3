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
import { getAllCustomers } from "@/actions/customers"; // Import the function

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

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const customersFromDb = await getAllCustomers(); // Call the imported function

        if (customersFromDb) {
          setCustomersData(customersFromDb as Customer[]); // Type assertion
        } else {
          setError(new Error("Failed to fetch customers from database.")); // Handle potential null return
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers (same as before)
  const filteredCustomers = customersData.filter(
    (customer) =>
      `${customer.firstname} ${customer.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get order count for each customer (Placeholder - Adapt if you fetch orders from DB)
  const getOrderCount = (customerId: string) => {
    return 0; // Placeholder
  };

  // Get initials for avatar (same as before)
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
      {/* ... rest of the component JSX is the same as before ... */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
        <Dialog>
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
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter customer name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter address" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Save Customer</Button>
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
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

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
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCustomers.length === 0 ? (
                <div className="col-span-full text-center py-10">No customers found.</div>
              ) : (
                filteredCustomers.map((customer) => (
                  <Card key={customer.customer_id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getInitials(`${customer.firstname} ${customer.lastname}`)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{`${customer.firstname} ${customer.lastname}`}</CardTitle>
                          <CardDescription>{customer.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Phone:</span>
                          <span>{customer.phone}</span>
                        </div>
                        {customer.dateRegistered && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Registered:</span>
                            <span>{customer.dateRegistered}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Orders:</span>
                          <span>{getOrderCount(customer.customer_id)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Orders
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}