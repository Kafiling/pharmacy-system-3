"use client"

import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, MoreHorizontal, Plus, Search, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type OrderStatus = "completed" | "processing" | "pending" | "cancelled"

interface Order {
  order_id: string
  customer_id: string
  employee_id: string
  order_date: string
  total_price: number
  status: OrderStatus
  customer_name?: string
}

interface OrderDetail {
  order_detail_id: string
  order_id: string
  medicine_id: string
  quantity: number
  payment: string
  medicine_name?: string
  medicine_price?: number
}

interface Customer {
  customer_id: string
  lastname: string
  phone: string
  email: string
  address: string
}

interface Medicine {
  medicine_id: string
  name: string
  price: number
}

export default function OrdersPage() {
  const supabase = createClientComponentClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Order creation state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [orderItems, setOrderItems] = useState<{
    medicine_id: string
    quantity: number
    price: number
    name: string
  }[]>([])
  const [newMedicineId, setNewMedicineId] = useState("")
  const [newQuantity, setNewQuantity] = useState(1)

  // View order state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([])

  // Fetch all necessary data - UPDATED TO GET FULL NAMES
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch orders with customer names (now getting both first and last names)
      const { data: ordersData, error: ordersError } = await supabase
        .from('order')
        .select(`
          *,
          customers:customer_id (firstname, lastname)
        `)
      
      if (ordersError) throw ordersError

      const enrichedOrders = ordersData.map(order => ({
        ...order,
        customer_name: `${order.customers?.firstname || ''} ${order.customers?.lastname || ''}`.trim()
      }))

      setOrders(enrichedOrders)

      // ... (rest of your fetchData implementation remains the same)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Create new order
  const handleCreateOrder = async () => {
    if (!selectedCustomerId || orderItems.length === 0) {
      setError("Please select a customer and add at least one item")
      return
    }

    try {
      // Get current user (employee)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Calculate total price
      const total_price = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('order')
        .insert([{
          customer_id: selectedCustomerId,
          employee_id: user.id,
          order_date: new Date().toISOString(),
          total_price,
          status: 'pending'
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order details
      const orderDetails = orderItems.map(item => ({
        order_id: order.order_id,
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        payment: paymentMethod
      }))

      const { error: detailsError } = await supabase
        .from('order_details')
        .insert(orderDetails)

      if (detailsError) throw detailsError

      // Refresh data and close dialog
      await fetchData()
      setDialogOpen(false)
      resetOrderForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order")
    }
  }

  // View order details
  const handleViewOrder = async (order: Order) => {
    try {
      const { data, error } = await supabase
        .from('order_details')
        .select(`
          *,
          medicines:medicine_id (name, price)
        `)
        .eq('order_id', order.order_id)

      if (error) throw error

      const enrichedDetails = data.map(detail => ({
        ...detail,
        medicine_name: detail.medicines?.name || 'Unknown',
        medicine_price: detail.medicines?.price || 0
      }))

      setSelectedOrder(order)
      setOrderDetails(enrichedDetails)
      setViewDialogOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order details")
    }
  }

  // Delete order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      // First delete order details to maintain referential integrity
      const { error: detailsError } = await supabase
        .from('order_details')
        .delete()
        .eq('order_id', orderId)

      if (detailsError) throw detailsError

      // Then delete the order
      const { error: orderError } = await supabase
        .from('order')
        .delete()
        .eq('order_id', orderId)

      if (orderError) throw orderError

      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order")
    }
  }

  const resetOrderForm = () => {
    setSelectedCustomerId("")
    setPaymentMethod("cash")
    setOrderItems([])
    setNewMedicineId("")
    setNewQuantity(1)
  }

  const addItemToOrder = () => {
    const medicine = medicines.find(m => m.medicine_id === newMedicineId)
    if (!medicine) {
      setError("Please select a valid medicine")
      return
    }

    setOrderItems([...orderItems, {
      medicine_id: newMedicineId,
      name: medicine.name,
      price: medicine.price,
      quantity: newQuantity
    }])

    setNewMedicineId("")
    setNewQuantity(1)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Order
        </Button>
      </div>

      {/* SEARCH BAR - NOW PROPERLY POSITIONED */}
      <div className="relative w-64 mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search orders..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ERROR MESSAGE - MOVED BELOW SEARCH */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                <TableCell>${order.total_price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={
                    order.status === 'completed' ? 'default' :
                    order.status === 'processing' ? 'secondary' :
                    order.status === 'pending' ? 'outline' : 'destructive'
                  }>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteOrder(order.order_id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Order Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Customer *</Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.customer_id} value={customer.customer_id}>
                      {customer.lastname} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Order Items *</Label>
              <div className="border rounded-md p-4">
                {orderItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items added yet</p>
                ) : (
                  <div className="space-y-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setOrderItems(orderItems.filter((_, i) => i !== index))}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label>Medicine</Label>
                    <Select value={newMedicineId} onValueChange={setNewMedicineId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medicine" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicines.map(medicine => (
                          <SelectItem key={medicine.medicine_id} value={medicine.medicine_id}>
                            {medicine.name} (${medicine.price.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addItemToOrder} className="w-full">
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setDialogOpen(false)
              resetOrderForm()
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder}>Create Order</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Order Information</h3>
                  <p>ID: {selectedOrder.order_id}</p>
                  <p>Date: {new Date(selectedOrder.order_date).toLocaleString()}</p>
                  <p>Status: <Badge variant={
                    selectedOrder.status === 'completed' ? 'default' :
                    selectedOrder.status === 'processing' ? 'secondary' :
                    selectedOrder.status === 'pending' ? 'outline' : 'destructive'
                  }>
                    {selectedOrder.status}
                  </Badge></p>
                </div>
                <div>
                  <h3 className="font-medium">Customer</h3>
                  <p>{selectedOrder.customer_name}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Items</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medicine</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderDetails.map(detail => (
                        <TableRow key={detail.order_detail_id}>
                          <TableCell>{detail.medicine_name}</TableCell>
                          <TableCell className="text-right">{detail.quantity}</TableCell>
                          <TableCell className="text-right">${detail.medicine_price?.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            ${((detail.medicine_price || 0) * detail.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Method: <span className="capitalize">{orderDetails[0]?.payment}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    Total: ${selectedOrder.total_price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}