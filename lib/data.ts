// Mock data for the pharmacy management system

// Medicine/Inventory data
export type Medicine = {
  id: string
  name: string
  category: string
  description: string
  stock: number
  price: number
  expiryDate: string
  supplier: string
  reorderLevel: number
}

export const medicines: Medicine[] = [
  {
    id: "med-001",
    name: "Paracetamol",
    category: "Pain Relief",
    description: "Pain reliever and fever reducer",
    stock: 150,
    price: 5.99,
    expiryDate: "2025-06-15",
    supplier: "MedSupply Inc.",
    reorderLevel: 30,
  },
  {
    id: "med-002",
    name: "Amoxicillin",
    category: "Antibiotics",
    description: "Antibiotic used to treat bacterial infections",
    stock: 85,
    price: 12.5,
    expiryDate: "2024-11-20",
    supplier: "PharmaCorp",
    reorderLevel: 20,
  },
  {
    id: "med-003",
    name: "Lisinopril",
    category: "Blood Pressure",
    description: "ACE inhibitor for high blood pressure",
    stock: 120,
    price: 8.75,
    expiryDate: "2025-03-10",
    supplier: "HealthMeds",
    reorderLevel: 25,
  },
  {
    id: "med-004",
    name: "Metformin",
    category: "Diabetes",
    description: "Oral medication for type 2 diabetes",
    stock: 95,
    price: 7.25,
    expiryDate: "2025-01-05",
    supplier: "MedSupply Inc.",
    reorderLevel: 20,
  },
  {
    id: "med-005",
    name: "Atorvastatin",
    category: "Cholesterol",
    description: "Statin medication to lower cholesterol",
    stock: 110,
    price: 15.99,
    expiryDate: "2024-12-15",
    supplier: "PharmaCorp",
    reorderLevel: 25,
  },
  {
    id: "med-006",
    name: "Albuterol",
    category: "Respiratory",
    description: "Bronchodilator for asthma and COPD",
    stock: 65,
    price: 22.5,
    expiryDate: "2025-02-28",
    supplier: "HealthMeds",
    reorderLevel: 15,
  },
  {
    id: "med-007",
    name: "Omeprazole",
    category: "Gastrointestinal",
    description: "Proton pump inhibitor for acid reflux",
    stock: 130,
    price: 9.99,
    expiryDate: "2025-05-20",
    supplier: "MedSupply Inc.",
    reorderLevel: 30,
  },
  {
    id: "med-008",
    name: "Loratadine",
    category: "Allergy",
    description: "Antihistamine for allergies",
    stock: 180,
    price: 6.5,
    expiryDate: "2025-07-10",
    supplier: "PharmaCorp",
    reorderLevel: 40,
  },
  {
    id: "med-009",
    name: "Sertraline",
    category: "Mental Health",
    description: "SSRI antidepressant",
    stock: 75,
    price: 18.25,
    expiryDate: "2024-10-15",
    supplier: "HealthMeds",
    reorderLevel: 20,
  },
  {
    id: "med-010",
    name: "Ibuprofen",
    category: "Pain Relief",
    description: "NSAID for pain and inflammation",
    stock: 200,
    price: 4.99,
    expiryDate: "2025-04-30",
    supplier: "MedSupply Inc.",
    reorderLevel: 50,
  },
]

// Order data
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled"

export type OrderItem = {
  medicineId: string
  medicineName: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  customerId: string
  customerName: string
  date: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentMethod: string
}

export const orders: Order[] = [
  {
    id: "ord-001",
    customerId: "cust-001",
    customerName: "John Smith",
    date: "2023-05-15",
    items: [
      {
        medicineId: "med-001",
        medicineName: "Paracetamol",
        quantity: 2,
        price: 5.99,
      },
      {
        medicineId: "med-010",
        medicineName: "Ibuprofen",
        quantity: 1,
        price: 4.99,
      },
    ],
    total: 16.97,
    status: "completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "ord-002",
    customerId: "cust-002",
    customerName: "Sarah Johnson",
    date: "2023-05-16",
    items: [
      {
        medicineId: "med-003",
        medicineName: "Lisinopril",
        quantity: 1,
        price: 8.75,
      },
    ],
    total: 8.75,
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "ord-003",
    customerId: "cust-003",
    customerName: "Michael Brown",
    date: "2023-05-17",
    items: [
      {
        medicineId: "med-005",
        medicineName: "Atorvastatin",
        quantity: 1,
        price: 15.99,
      },
      {
        medicineId: "med-007",
        medicineName: "Omeprazole",
        quantity: 1,
        price: 9.99,
      },
    ],
    total: 25.98,
    status: "processing",
    paymentMethod: "Credit Card",
  },
  {
    id: "ord-004",
    customerId: "cust-004",
    customerName: "Emily Davis",
    date: "2023-05-18",
    items: [
      {
        medicineId: "med-008",
        medicineName: "Loratadine",
        quantity: 3,
        price: 6.5,
      },
    ],
    total: 19.5,
    status: "pending",
    paymentMethod: "Insurance",
  },
  {
    id: "ord-005",
    customerId: "cust-005",
    customerName: "Robert Wilson",
    date: "2023-05-19",
    items: [
      {
        medicineId: "med-002",
        medicineName: "Amoxicillin",
        quantity: 1,
        price: 12.5,
      },
    ],
    total: 12.5,
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "ord-006",
    customerId: "cust-001",
    customerName: "John Smith",
    date: "2023-05-20",
    items: [
      {
        medicineId: "med-006",
        medicineName: "Albuterol",
        quantity: 1,
        price: 22.5,
      },
    ],
    total: 22.5,
    status: "cancelled",
    paymentMethod: "Credit Card",
  },
  {
    id: "ord-007",
    customerId: "cust-006",
    customerName: "Lisa Martinez",
    date: "2023-05-21",
    items: [
      {
        medicineId: "med-004",
        medicineName: "Metformin",
        quantity: 2,
        price: 7.25,
      },
      {
        medicineId: "med-009",
        medicineName: "Sertraline",
        quantity: 1,
        price: 18.25,
      },
    ],
    total: 32.75,
    status: "processing",
    paymentMethod: "Insurance",
  },
]

// Customer data
export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  dateRegistered: string
}

export const customers: Customer[] = [
  {
    id: "cust-001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, CA 12345",
    dateRegistered: "2022-01-15",
  },
  {
    id: "cust-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "555-234-5678",
    address: "456 Oak Ave, Somewhere, NY 67890",
    dateRegistered: "2022-02-20",
  },
  {
    id: "cust-003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "555-345-6789",
    address: "789 Pine Rd, Nowhere, TX 54321",
    dateRegistered: "2022-03-10",
  },
  {
    id: "cust-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-456-7890",
    address: "321 Cedar Ln, Elsewhere, FL 98765",
    dateRegistered: "2022-04-05",
  },
  {
    id: "cust-005",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    phone: "555-567-8901",
    address: "654 Birch Blvd, Anywhere, WA 13579",
    dateRegistered: "2022-05-12",
  },
  {
    id: "cust-006",
    name: "Lisa Martinez",
    email: "lisa.martinez@example.com",
    phone: "555-678-9012",
    address: "987 Maple Dr, Someplace, IL 24680",
    dateRegistered: "2022-06-18",
  },
]

// Supplier data
export type Supplier = {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  products: string[]
}

export const suppliers: Supplier[] = [
  {
    id: "sup-001",
    name: "MedSupply Inc.",
    contactPerson: "David Johnson",
    email: "david@medsupply.com",
    phone: "555-111-2222",
    address: "100 Industry Way, Metropolis, NY 10001",
    products: ["Pain Relief", "Gastrointestinal", "Allergy"],
  },
  {
    id: "sup-002",
    name: "PharmaCorp",
    contactPerson: "Jennifer Lee",
    email: "jennifer@pharmacorp.com",
    phone: "555-222-3333",
    address: "200 Pharma Blvd, Bigcity, CA 90210",
    products: ["Antibiotics", "Cholesterol", "Allergy"],
  },
  {
    id: "sup-003",
    name: "HealthMeds",
    contactPerson: "Michael Rodriguez",
    email: "michael@healthmeds.com",
    phone: "555-333-4444",
    address: "300 Health Ave, Wellness, TX 75001",
    products: ["Blood Pressure", "Respiratory", "Mental Health"],
  },
]

// Dashboard statistics
export type DashboardStats = {
  totalSales: number
  totalOrders: number
  lowStockItems: number
  pendingOrders: number
  topSellingMedicines: {
    name: string
    sales: number
  }[]
  recentSales: {
    date: string
    amount: number
  }[]
  stockDistribution: {
    category: string
    count: number
  }[]
}

export const dashboardStats: DashboardStats = {
  totalSales: 2450.75,
  totalOrders: 42,
  lowStockItems: 3,
  pendingOrders: 7,
  topSellingMedicines: [
    { name: "Paracetamol", sales: 120 },
    { name: "Ibuprofen", sales: 95 },
    { name: "Amoxicillin", sales: 78 },
    { name: "Omeprazole", sales: 65 },
    { name: "Loratadine", sales: 52 },
  ],
  recentSales: [
    { date: "May 15", amount: 350.25 },
    { date: "May 16", amount: 275.5 },
    { date: "May 17", amount: 410.75 },
    { date: "May 18", amount: 320.0 },
    { date: "May 19", amount: 390.5 },
    { date: "May 20", amount: 285.25 },
    { date: "May 21", amount: 418.5 },
  ],
  stockDistribution: [
    { category: "Pain Relief", count: 350 },
    { category: "Antibiotics", count: 85 },
    { category: "Blood Pressure", count: 120 },
    { category: "Diabetes", count: 95 },
    { category: "Cholesterol", count: 110 },
    { category: "Respiratory", count: 65 },
    { category: "Gastrointestinal", count: 130 },
    { category: "Allergy", count: 180 },
    { category: "Mental Health", count: 75 },
  ],
}

