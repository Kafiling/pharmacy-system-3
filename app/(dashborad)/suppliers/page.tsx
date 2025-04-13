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
import { Edit, Mail, MoreHorizontal, Phone, Plus, Search, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllSuppliers, deleteSupplier } from "@/actions/suppliers" // Import deleteSupplier action
import { type Supplier } from "@/lib/data" // Keep the type definition, but we will adjust it if needed

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // State to hold fetched suppliers
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [viewSupplierDetails, setViewSupplierDetails] = useState(false)
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      const data = await getAllSuppliers();
      if (data) {
        // Transform the data to match the expected Supplier type and structure
        const transformedSuppliers = data.map((supplier) => ({
          id: supplier.supplier_id, // Assuming supplier_id is the correct ID field
          name: supplier.supplier_name,
          contactPerson: "Contact Person", // Contact person is not in DB, set default or handle differently
          email: supplier.supplier_email,
          phone: supplier.supplier_phone,
          address: supplier.supplier_address,
          products: [], // Products are not in DB, set empty array or handle differently
        }));
        setSuppliers(transformedSuppliers);
      } else {
        console.error("Failed to fetch suppliers.");
        setSuppliers([]); // Set to empty array in case of error
      }
      setLoading(false);
    };

    fetchSuppliers();
  }, []);

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()), // contactPerson might need adjustment
  )

  const handleDeleteSupplier = async (supplierId: string) => {
    const result = await deleteSupplier(supplierId);
    if (!result.error) {
      // Optimistically update the UI by removing the deleted supplier
      setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId));
      console.log(`Supplier with ID ${supplierId} deleted successfully`);
      // Optionally you could refetch suppliers here to ensure data is up-to-date
      // fetchSuppliers();
    } else {
      console.error(`Failed to delete supplier with ID ${supplierId}`);
      // Handle error, maybe show a toast notification to the user
    }
  };


  if (loading) {
    return <div>Loading suppliers...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>Enter the details of the new supplier to add to your contacts.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Supplier Name</Label>
                  <Input id="name" placeholder="Enter supplier name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input id="contactPerson" placeholder="Enter contact person" />
                </div>
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
                <Textarea id="address" placeholder="Enter address" />
              </div>
              {/* Products field removed for now as it's not in the DB schema */}
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Save Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search suppliers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                    <TableHead>Contact Person</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    {/* Products column removed for now */}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No suppliers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.id}</TableCell>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.contactPerson}</TableCell>
                        <TableCell className="hidden md:table-cell">{supplier.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{supplier.phone}</TableCell>
                        {/* Products cell removed for now */}
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
                                  setSelectedSupplier(supplier)
                                  setViewSupplierDetails(true)
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteSupplier(supplier.id)} // Call handleDeleteSupplier
                              >
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
              {filteredSuppliers.length === 0 ? (
                <div className="col-span-full text-center py-10">No suppliers found.</div>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <Card key={supplier.id}>
                    <CardHeader>
                      <CardTitle>{supplier.name}</CardTitle>
                      <CardDescription>{supplier.contactPerson}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{supplier.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{supplier.phone}</span>
                        </div>
                        {/* Products section removed for now */}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSupplier(supplier)
                          setViewSupplierDetails(true)
                        }}
                      >
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSupplier(supplier.id)} // Call handleDeleteSupplier
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Supplier Details Dialog */}
      <Dialog open={viewSupplierDetails} onOpenChange={setViewSupplierDetails}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>{selectedSupplier && `Supplier ID: ${selectedSupplier.id}`}</DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Supplier Name</h3>
                  <p>{selectedSupplier.name}</p>
                </div>
                <div>
                  <h3 className="font-medium">Contact Person</h3>
                  <p>{selectedSupplier.contactPerson}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p>{selectedSupplier.email}</p>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p>{selectedSupplier.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Address</h3>
                <p>{selectedSupplier.address}</p>
              </div>
              {/* Products details removed for now */}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewSupplierDetails(false)}>
              Close
            </Button>
            <Button>Contact Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}