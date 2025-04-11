import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getRecentOrder } from "@/actions/dashboard";
import {
  AlertTriangle,
  FileText,
  PillIcon,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const order = (await getRecentOrder()) || [];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Dr. Sarah</p>
      </div>

      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-800" />
        <AlertTitle className="text-amber-800 font-medium">
          Low Stock Alert
        </AlertTitle>
        <AlertDescription className="text-amber-700">
          4 medications are running low on stock.{" "}
          <Link href="/inventory" className="text-pharma-600 font-medium">
            View all
          </Link>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Medications
              </p>
              <h3 className="text-2xl font-bold mt-1">5</h3>
            </div>
            <div className="stat-icon bg-blue-100">
              <PillIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600">↑ 3.2% </span>
            <span className="text-xs text-muted-foreground">
              from last month
            </span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Today's Orders
              </p>
              <h3 className="text-2xl font-bold mt-1">4</h3>
            </div>
            <div className="stat-icon bg-green-100">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600">↑ 12% </span>
            <span className="text-xs text-muted-foreground">
              from yesterday
            </span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </p>
              <h3 className="text-2xl font-bold mt-1">4</h3>
            </div>
            <div className="stat-icon bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-red-600">↑ 2 </span>
            <span className="text-xs text-muted-foreground">
              more than yesterday
            </span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Revenue (Today)
              </p>
              <h3 className="text-2xl font-bold mt-1">$463.45</h3>
            </div>
            <div className="stat-icon bg-purple-100">
              <svg
                className="h-5 w-5 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600">↑ 8.1% </span>
            <span className="text-xs text-muted-foreground">
              from yesterday
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-medium">Recent Orders</h3>
            <Link href="/orders" className="text-sm text-pharma-600">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-left text-muted-foreground bg-muted/50">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm text-pharma-600">
                    ORD-5392
                  </td>
                  <td className="px-4 py-3 text-sm">Unknown</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">$125.00</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    10:07 PM
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm text-pharma-600">
                    ORD-5391
                  </td>
                  <td className="px-4 py-3 text-sm">Unknown</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      Processing
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">$78.50</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    10:07 PM
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm text-pharma-600">
                    ORD-5390
                  </td>
                  <td className="px-4 py-3 text-sm">Unknown</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">$214.75</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    10:07 PM
                  </td>
                </tr>
                <div>
                  {order.map((order: any) => (
                    <div key={order.order_id}>
                      <h2>{order.customer_id}</h2>
                    </div>
                  ))}
                </div>
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-medium">Low Stock Medications</h3>
            <Button
              variant="outline"
              size="sm"
              className="text-pharma-600 border-pharma-600 hover:bg-pharma-50"
            >
              Place Order
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-left text-muted-foreground bg-muted/50">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Supplier</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md mr-2">
                        <PillIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Amoxicillin</div>
                        <div className="text-xs text-muted-foreground">
                          500mg
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>10 boxes</div>
                    <div className="text-xs text-muted-foreground">
                      Min: 20 boxes
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-critical">Critical</span>
                  </td>
                  <td className="px-4 py-3 text-sm">Unknown</td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-pharma-600 hover:text-pharma-700 hover:bg-pharma-50"
                    >
                      Order
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md mr-2">
                        <PillIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Lisinopril</div>
                        <div className="text-xs text-muted-foreground">
                          10mg
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>8 bottles</div>
                    <div className="text-xs text-muted-foreground">
                      Min: 15 bottles
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-low">Low</span>
                  </td>
                  <td className="px-4 py-3 text-sm">Unknown</td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-pharma-600 hover:text-pharma-700 hover:bg-pharma-50"
                    >
                      Order
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md mr-2">
                        <PillIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Atorvastatin</div>
                        <div className="text-xs text-muted-foreground">
                          20mg
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>12 boxes</div>
                    <div className="text-xs text-muted-foreground">
                      Min: 25 boxes
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-critical">Critical</span>
                  </td>
                  <td className="px-4 py-3 text-sm">Unknown</td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-pharma-600 hover:text-pharma-700 hover:bg-pharma-50"
                    >
                      Order
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md mr-2">
                        <PillIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Metformin</div>
                        <div className="text-xs text-muted-foreground">
                          850mg
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>15 bottles</div>
                    <div className="text-xs text-muted-foreground">
                      Min: 30 bottles
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-critical">Critical</span>
                  </td>
                  <td className="px-4 py-3 text-sm">Unknown</td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-pharma-600 hover:text-pharma-700 hover:bg-pharma-50"
                    >
                      Order
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="font-medium">Sales Overview</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-pharma-600 text-white hover:bg-pharma-700"
            >
              Weekly
            </Button>
            <Button variant="outline" size="sm">
              Monthly
            </Button>
            <Button variant="outline" size="sm">
              Yearly
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="h-64 w-full">
            {/* This would be a chart component in a real implementation */}
            <div className="flex items-end justify-between h-48 w-full px-2">
              <div className="w-1/7 flex flex-col items-center">
                <div
                  className="w-12 bg-pharma-500 rounded-t-sm"
                  style={{ height: "60%" }}
                ></div>
                <span className="text-xs mt-2">Mon</span>
              </div>
              <div className="w-1/7 flex flex-col items-center">
                <div
                  className="w-12 bg-pharma-500 rounded-t-sm"
                  style={{ height: "45%" }}
                ></div>
                <span className="text-xs mt-2">Tue</span>
              </div>
              <div className="w-1/7 flex flex-col items-center">
                <div
                  className="w-12 bg-pharma-500 rounded-t-sm"
                  style={{ height: "75%" }}
                ></div>
                <span className="text-xs mt-2">Wed</span>
              </div>
              <div className="w-1/7 flex flex-col items-center">
                <div
                  className="w-12 bg-pharma-500 rounded-t-sm"
                  style={{ height: "40%" }}
                ></div>
                <span className="text-xs mt-2">Thu</span>
              </div>
              <div className="w-1/7 flex flex-col items-center">
                <div
                  className="w-12 bg-pharma-500 rounded-t-sm"
                  style={{ height: "80%" }}
                ></div>
                <span className="text-xs mt-2">Fri</span>
              </div>
              <div className="w-1/7 flex flex-col items-center">
                <div
                  className="w-12 bg-pharma-500 rounded-t-sm"
                  style={{ height: "50%" }}
                ></div>
                <span className="text-xs mt-2">Sat</span>
              </div>
              <div className="w-1/7 flex flex-col items-center">
                <div
                  className="w-12 bg-pharma-500 rounded-t-sm"
                  style={{ height: "35%" }}
                ></div>
                <span className="text-xs mt-2">Sun</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-xl font-bold text-pharma-600">$42,389</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Customers</p>
              <p className="text-xl font-bold text-pharma-600">1,852</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Orders</p>
              <p className="text-xl font-bold text-pharma-600">3,426</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Avg. Order Value</p>
              <p className="text-xl font-bold text-pharma-600">$64.25</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-medium mb-1">New Order</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a new customer order
          </p>
          <Button variant="outline" className="w-full">
            Create
          </Button>
        </Card>

        <Card className="p-4 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <PillIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-medium mb-1">Add Medication</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add new medication to inventory
          </p>
          <Button variant="outline" className="w-full">
            Add
          </Button>
        </Card>

        <Card className="p-4 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <Truck className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-medium mb-1">Order Supplies</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Place orders with suppliers
          </p>
          <Button variant="outline" className="w-full">
            Order
          </Button>
        </Card>

        <Card className="p-4 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-medium mb-1">Generate Report</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create inventory and sales reports
          </p>
          <Button variant="outline" className="w-full">
            Generate
          </Button>
        </Card>
      </div>
    </div>
  );
}
