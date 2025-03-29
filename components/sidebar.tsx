"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PillIcon, ShoppingCart, Users, Truck, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: PillIcon,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 z-[80] bg-white border-r">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
          <Link href="/" className="flex items-center">
            <PillIcon className="h-6 w-6 text-pharma-600 mr-2" />
            <h1 className="text-xl font-bold text-pharma-600">PharmaCare</h1>
          </Link>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  pathname === item.href
                    ? "bg-pharma-50 text-pharma-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    pathname === item.href ? "text-pharma-600" : "text-gray-400 group-hover:text-gray-500",
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t p-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/placeholder-user.jpg" alt="Dr. Sarah Johnson" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="ml-1">
              <p className="text-sm font-medium text-gray-700">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500">Pharmacist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

