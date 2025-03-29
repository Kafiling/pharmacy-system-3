"use client"
import { Menu, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from "./sidebar"

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0 sm:max-w-xs">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex items-center justify-end gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search medications..." className="w-full pl-8 rounded-md border" />
        </div>

        <Button className="bg-pharma-600 hover:bg-pharma-700">
          <Plus className="mr-2 h-4 w-4" />
          Quick Order
        </Button>
      </div>
    </header>
  )
}

