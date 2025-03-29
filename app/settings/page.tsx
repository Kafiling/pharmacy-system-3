"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">Manage your pharmacy settings and preferences.</p>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Information</CardTitle>
              <CardDescription>Update your pharmacy details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                  <Input id="pharmacyName" defaultValue="PharmaCare" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input id="licenseNumber" defaultValue="PHM-12345-XYZ" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contact@pharmacare.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="555-123-4567" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue="123 Pharmacy Street, Medville, CA 12345" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your pharmacy's operating hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-sm text-muted-foreground">Weekdays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-24" defaultValue="9:00" />
                    <span>to</span>
                    <Input className="w-24" defaultValue="18:00" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">Saturday</span>
                    <span className="text-sm text-muted-foreground">Weekend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-24" defaultValue="10:00" />
                    <span>to</span>
                    <Input className="w-24" defaultValue="16:00" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">Sunday</span>
                    <span className="text-sm text-muted-foreground">Weekend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-24" defaultValue="Closed" />
                    <span>to</span>
                    <Input className="w-24" defaultValue="Closed" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Hours</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you want to receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="low-stock" className="flex flex-col space-y-1">
                  <span>Low Stock Alerts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive notifications when items are low in stock
                  </span>
                </Label>
                <Switch id="low-stock" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="expiry" className="flex flex-col space-y-1">
                  <span>Expiry Date Alerts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive notifications for medicines nearing expiry
                  </span>
                </Label>
                <Switch id="expiry" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="orders" className="flex flex-col space-y-1">
                  <span>New Order Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive notifications for new customer orders
                  </span>
                </Label>
                <Switch id="orders" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                  <span>Marketing Updates</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive updates about new features and promotions
                  </span>
                </Label>
                <Switch id="marketing" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Delivery</CardTitle>
              <CardDescription>Choose how you want to receive different types of notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="mb-2 block">Low Stock Alerts</Label>
                  <Select defaultValue="both">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="sms">SMS Only</SelectItem>
                      <SelectItem value="both">Email & SMS</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Expiry Alerts</Label>
                  <Select defaultValue="email">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="sms">SMS Only</SelectItem>
                      <SelectItem value="both">Email & SMS</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Order Notifications</Label>
                  <Select defaultValue="both">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="sms">SMS Only</SelectItem>
                      <SelectItem value="both">Email & SMS</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Delivery Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="2fa" className="flex flex-col space-y-1">
                  <span>Enable Two-Factor Authentication</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Require a verification code when logging in
                  </span>
                </Label>
                <Switch id="2fa" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone-2fa">Phone Number for 2FA</Label>
                <Input id="phone-2fa" placeholder="Enter phone number" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize the appearance of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Color Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="default" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-primary"></span>
                    Light
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-black"></span>
                    Dark
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-gray-400"></span>
                    System
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="animations" className="flex flex-col space-y-1">
                  <span>Interface Animations</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Enable animations throughout the interface
                  </span>
                </Label>
                <Switch id="animations" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="compact" className="flex flex-col space-y-1">
                  <span>Compact Mode</span>
                  <span className="font-normal text-sm text-muted-foreground">Reduce spacing to show more content</span>
                </Label>
                <Switch id="compact" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Appearance</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

