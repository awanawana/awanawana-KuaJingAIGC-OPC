// Mock data for clothing store

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
  sales: number;
  rating: number;
  reviews: number;
  featured: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface DashboardStats {
  todayOrders: number;
  todaySales: number;
  todayVisitors: number;
  conversionRate: number;
  weeklySales: { day: string; sales: number }[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Urban Street Hoodie",
    price: 89,
    originalPrice: 129,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800"
    ],
    category: "Hoodies",
    description: "Premium cotton blend hoodie with modern urban design. Features distressed graphics and comfortable fit.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy"],
    sales: 12847,
    rating: 4.8,
    reviews: 2341,
    featured: true
  },
  {
    id: "2",
    name: "Oversized Tee Collection",
    price: 45,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
    ],
    category: "T-Shirts",
    description: "100% organic cotton oversized tee. Perfect for layered looks.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Beige"],
    sales: 9823,
    rating: 4.6,
    reviews: 1876,
    featured: true
  },
  {
    id: "3",
    name: "Cargo Tech Pants",
    price: 129,
    originalPrice: 179,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800"
    ],
    category: "Pants",
    description: "Multi-pocket cargo pants with water-resistant technology.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Khaki", "Olive"],
    sales: 7654,
    rating: 4.7,
    reviews: 1234,
    featured: true
  },
  {
    id: "4",
    name: "Vintage Denim Jacket",
    price: 199,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600",
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800"
    ],
    category: "Jackets",
    description: "Classic vintage wash denim jacket with modern cut.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"],
    sales: 5432,
    rating: 4.9,
    reviews: 987,
    featured: true
  },
  {
    id: "5",
    name: "Athleisure Joggers",
    price: 79,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800"
    ],
    category: "Pants",
    description: "Comfortable joggers perfect for workout or casual wear.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy"],
    sales: 11234,
    rating: 4.5,
    reviews: 2156,
    featured: false
  },
  {
    id: "6",
    name: "Graphic Print Sweater",
    price: 99,
    originalPrice: 149,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"
    ],
    category: "Sweaters",
    description: "Cozy sweater with bold graphic prints.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Red"],
    sales: 6789,
    rating: 4.6,
    reviews: 1234,
    featured: false
  },
  {
    id: "7",
    name: "Silk Blend Blouse",
    price: 149,
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600",
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800"
    ],
    category: "Tops",
    description: "Elegant silk blend blouse for sophisticated looks.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Pink", "Black"],
    sales: 4321,
    rating: 4.8,
    reviews: 876,
    featured: false
  },
  {
    id: "8",
    name: "Leather Biker Jacket",
    price: 399,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
    ],
    category: "Jackets",
    description: "Genuine leather biker jacket with metal hardware.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    sales: 2345,
    rating: 4.9,
    reviews: 567,
    featured: true
  },
  // New products 9-38
  {
    id: "9",
    name: "Cropped Puffer Jacket",
    price: 189,
    originalPrice: 249,
    image: "https://images.unsplash.com/photo-1544923246-77307dd628b7?w=600",
    images: ["https://images.unsplash.com/photo-1544923246-77307dd628b7?w=800"],
    category: "Jackets",
    description: "Lightweight cropped puffer with water-resistant shell.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Cream", "Lavender"],
    sales: 8921,
    rating: 4.7,
    reviews: 1654,
    featured: true
  },
  {
    id: "10",
    name: "High-Waist Cargo Pants",
    price: 98,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"],
    category: "Pants",
    description: "High-waisted cargo pants with adjustable belt.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Army Green", "Brown"],
    sales: 7654,
    rating: 4.6,
    reviews: 1432,
    featured: false
  },
  {
    id: "11",
    name: "Fleece Lined Hoodie",
    price: 79,
    originalPrice: 99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"],
    category: "Hoodies",
    description: "Ultra-soft fleece lined hoodie for cold weather.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal", "Navy", "Burgundy"],
    sales: 11234,
    rating: 4.8,
    reviews: 2187,
    featured: true
  },
  {
    id: "12",
    name: "Linen Blend Shorts",
    price: 55,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600",
    images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800"],
    category: "Pants",
    description: "Breathable linen blend shorts for summer.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Beige", "Navy"],
    sales: 6543,
    rating: 4.4,
    reviews: 987,
    featured: false,
  },
  {
    id: "13",
    name: "Oversized Blazer",
    price: 189,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800"],
    category: "Jackets",
    description: "Contemporary oversized blazer with lapel collar.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Gray", "Camel"],
    sales: 5678,
    rating: 4.7,
    reviews: 1234,
    featured: true
  },
  {
    id: "14",
    name: "Graphic Tee - Abstract",
    price: 39,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600",
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"],
    category: "T-Shirts",
    description: "Soft cotton tee with abstract art print.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray"],
    sales: 9876,
    rating: 4.5,
    reviews: 1876,
    featured: false
  },
  {
    id: "15",
    name: "Wool Blend Coat",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600",
    images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800"],
    category: "Jackets",
    description: "Premium wool blend overcoat for elegant occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Camel", "Black", "Gray"],
    sales: 3214,
    rating: 4.9,
    reviews: 654,
    featured: true
  },
  {
    id: "16",
    name: "Athletic Tank Top",
    price: 29,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600",
    images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800"],
    category: "T-Shirts",
    description: "Moisture-wicking athletic tank for workouts.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Neon Green"],
    sales: 8765,
    rating: 4.3,
    reviews: 1543,
    featured: false
  },
  {
    id: "17",
    name: "Satin Midi Skirt",
    price: 89,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600",
    images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800"],
    category: "Pants",
    description: "Elegant satin skirt with pleated detail.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Champagne", "Emerald"],
    sales: 4532,
    rating: 4.6,
    reviews: 876,
    featured: false
  },
  {
    id: "18",
    name: "Zip-Up Hoodie",
    price: 75,
    originalPrice: 95,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"],
    category: "Hoodies",
    description: "Full-zip hoodie with kangaroo pocket.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Heather Gray", "Navy", "Black"],
    sales: 10234,
    rating: 4.6,
    reviews: 1987,
    featured: true
  },
  {
    id: "19",
    name: "Distressed Jeans",
    price: 89,
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600",
    images: ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800"],
    category: "Pants",
    description: "Classic distressed denim with comfortable stretch.",
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    sales: 7890,
    rating: 4.5,
    reviews: 1654,
    featured: false
  },
  {
    id: "20",
    name: "Bomber Jacket",
    price: 169,
    originalPrice: 219,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"],
    category: "Jackets",
    description: "Classic bomber jacket with ribbed cuffs.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Forest Green", "Burgundy"],
    sales: 5678,
    rating: 4.7,
    reviews: 1123,
    featured: true
  },
  {
    id: "21",
    name: "Longline T-Shirt",
    price: 35,
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600",
    images: ["https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800"],
    category: "T-Shirts",
    description: "Extended length tee for layered styling.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Olive"],
    sales: 6543,
    rating: 4.4,
    reviews: 1234,
    featured: false
  },
  {
    id: "22",
    name: "Quilted Vest",
    price: 119,
    image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600",
    images: ["https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800"],
    category: "Jackets",
    description: "Lightweight quilted vest for layering.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Tan"],
    sales: 4321,
    rating: 4.6,
    reviews: 876,
    featured: false
  },
  {
    id: "23",
    name: "Pullover Sweater",
    price: 89,
    originalPrice: 129,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600",
    images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800"],
    category: "Sweaters",
    description: "Classic cable knit pullover sweater.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Navy", "Burgundy"],
    sales: 5432,
    rating: 4.7,
    reviews: 1098,
    featured: true
  },
  {
    id: "24",
    name: "Slim Fit Chinos",
    price: 79,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600",
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"],
    category: "Pants",
    description: "Tailored slim fit chinos for smart casual.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Black", "Gray"],
    sales: 6789,
    rating: 4.5,
    reviews: 1345,
    featured: false
  },
  {
    id: "25",
    name: "Velvet Blazer",
    price: 229,
    image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=600",
    images: ["https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800"],
    category: "Jackets",
    description: "Luxurious velvet blazer for special events.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Burgundy", "Navy", "Forest Green"],
    sales: 2345,
    rating: 4.8,
    reviews: 567,
    featured: true
  },
  {
    id: "26",
    name: "Striped Polo Shirt",
    price: 49,
    image: "https://images.unsplash.com/photo-1625910513413-5fc45b32e18d?w=600",
    images: ["https://images.unsplash.com/photo-1625910513413-5fc45b32e18d?w=800"],
    category: "T-Shirts",
    description: "Classic striped polo with embroidered logo.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy/White", "Red/White", "Black/White"],
    sales: 5432,
    rating: 4.5,
    reviews: 987,
    featured: false
  },
  {
    id: "27",
    name: "Trench Coat",
    price: 259,
    originalPrice: 329,
    image: "https://images.unsplash.com/photo-1591363044873-3c03630376d4?w=600",
    images: ["https://images.unsplash.com/photo-1591363044873-3c03630376d4?w=800"],
    category: "Jackets",
    description: "Classic trench coat with belt closure.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Black", "Olive"],
    sales: 3456,
    rating: 4.8,
    reviews: 765,
    featured: true
  },
  {
    id: "28",
    name: "Relaxed Fit Jeans",
    price: 79,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"],
    category: "Pants",
    description: "Comfortable relaxed fit denim jeans.",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Light Blue", "Medium Blue", "Dark Blue"],
    sales: 8976,
    rating: 4.6,
    reviews: 1765,
    featured: false
  },
  {
    id: "29",
    name: "Hooded Puffer Coat",
    price: 249,
    originalPrice: 329,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600",
    images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800"],
    category: "Jackets",
    description: "Warm hooded puffer for winter conditions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray"],
    sales: 4567,
    rating: 4.7,
    reviews: 890,
    featured: true
  },
  {
    id: "30",
    name: "Round Neck Tee",
    price: 25,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
    category: "T-Shirts",
    description: "Essential cotton round neck t-shirt.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy"],
    sales: 15678,
    rating: 4.4,
    reviews: 3245,
    featured: false
  },
  {
    id: "31",
    name: "Windbreaker Jacket",
    price: 139,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600",
    images: ["https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800"],
    category: "Jackets",
    description: "Lightweight windbreaker with adjustable hood.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Orange", "Yellow", "Black", "Navy"],
    sales: 5678,
    rating: 4.5,
    reviews: 1098,
    featured: false
  },
  {
    id: "32",
    name: "Sweatpants",
    price: 49,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600",
    images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800"],
    category: "Pants",
    description: "Cozy fleece sweatpants for lounging.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Black", "Navy", "Burgundy"],
    sales: 12345,
    rating: 4.6,
    reviews: 2345,
    featured: false
  },
  {
    id: "33",
    name: "Cardigan",
    price: 109,
    originalPrice: 149,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600",
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"],
    category: "Sweaters",
    description: "Soft knit cardigan with button front.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Black", "Camel"],
    sales: 4321,
    rating: 4.7,
    reviews: 876,
    featured: false
  },
  {
    id: "34",
    name: "Button-Down Shirt",
    price: 69,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"],
    category: "Tops",
    description: "Classic button-down oxford shirt.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink"],
    sales: 6543,
    rating: 4.6,
    reviews: 1234,
    featured: false
  },
  {
    id: "35",
    name: "Leather Moto Jacket",
    price: 449,
    originalPrice: 599,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"],
    category: "Jackets",
    description: "Premium leather moto jacket with details.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    sales: 1876,
    rating: 4.9,
    reviews: 432,
    featured: true
  },
  {
    id: "36",
    name: "Jogger Pants",
    price: 59,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600",
    images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800"],
    category: "Pants",
    description: "Modern jogger with tapered leg.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy"],
    sales: 9876,
    rating: 4.5,
    reviews: 1987,
    featured: false
  },
  {
    id: "37",
    name: "Crop Top",
    price: 29,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600",
    images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800"],
    category: "Tops",
    description: "Trendy crop top for casual wear.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Black", "Coral", "Lavender"],
    sales: 8765,
    rating: 4.4,
    reviews: 1654,
    featured: false
  },
  {
    id: "38",
    name: "Rain Jacket",
    price: 149,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"],
    category: "Jackets",
    description: "Waterproof rain jacket with sealed seams.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Yellow", "Navy", "Black", "Green"],
    sales: 5432,
    rating: 4.6,
    reviews: 1098,
    featured: false
  }
];

export const productReviews: Record<string, Review[]> = {
  "1": [
    { id: "r1", userId: "u1", userName: "Alex M.", avatar: "https://i.pravatar.cc/100?img=1", rating: 5, comment: "Best hoodie I've ever owned! The quality is amazing.", date: "2024-01-15", verified: true },
    { id: "r2", userId: "u2", userName: "Jordan K.", avatar: "https://i.pravatar.cc/100?img=2", rating: 5, comment: "Super comfortable and warm. Fits perfectly!", date: "2024-01-10", verified: true },
    { id: "r3", userId: "u3", userName: "Chris L.", avatar: "https://i.pravatar.cc/100?img=3", rating: 4, comment: "Great quality, sizing runs slightly small.", date: "2024-01-05", verified: true },
    { id: "r4", userId: "u4", userName: "Taylor R.", avatar: "https://i.pravatar.cc/100?img=4", rating: 5, comment: "Love the design! Gets compliments all the time.", date: "2023-12-28", verified: true },
  ],
  "2": [
    { id: "r5", userId: "u5", userName: "Sam W.", avatar: "https://i.pravatar.cc/100?img=5", rating: 5, comment: "Perfect oversized fit. Great for layering!", date: "2024-01-12", verified: true },
    { id: "r6", userId: "u6", userName: "Riley T.", avatar: "https://i.pravatar.cc/100?img=6", rating: 4, comment: "Soft fabric, but shrinks a bit after washing.", date: "2024-01-08", verified: true },
  ],
  "3": [
    { id: "r7", userId: "u7", userName: "Casey M.", avatar: "https://i.pravatar.cc/100?img=7", rating: 5, comment: "Lots of pockets! Perfect for hiking.", date: "2024-01-14", verified: true },
    { id: "r8", userId: "u8", userName: "Quinn D.", avatar: "https://i.pravatar.cc/100?img=8", rating: 5, comment: "Great material, true to size.", date: "2024-01-09", verified: true },
  ],
  "9": [
    { id: "r9", userId: "u9", userName: "Avery P.", avatar: "https://i.pravatar.cc/100?img=9", rating: 5, comment: "Keeps me warm even in coldest days!", date: "2024-01-11", verified: true },
    { id: "r10", userId: "u10", userName: "Blake H.", avatar: "https://i.pravatar.cc/100?img=10", rating: 4, comment: "Cute style but runs small.", date: "2024-01-07", verified: true },
  ],
  "11": [
    { id: "r11", userId: "u11", userName: "Drew J.", avatar: "https://i.pravatar.cc/100?img=11", rating: 5, comment: "So warm and cozy! Best purchase.", date: "2024-01-13", verified: true },
    { id: "r12", userId: "u12", userName: "Morgan S.", avatar: "https://i.pravatar.cc/100?img=12", rating: 5, comment: "Perfect for winter layering.", date: "2024-01-06", verified: true },
  ]
};

export const dashboardStats: DashboardStats = {
  todayOrders: 347,
  todaySales: 28450,
  todayVisitors: 8934,
  conversionRate: 3.89,
  weeklySales: [
    { day: "周一", sales: 12400 },
    { day: "周二", sales: 15800 },
    { day: "周三", sales: 18200 },
    { day: "周四", sales: 14600 },
    { day: "周五", sales: 21300 },
    { day: "周六", sales: 28450 },
    { day: "周日", sales: 22100 }
  ]
};

export const categories = [
  "全部",
  "Hoodies",
  "T-Shirts",
  "Pants",
  "Jackets",
  "Sweaters",
  "Tops"
];

export const aiProductSuggestions = [
  { name: "斜挎工装包", demand: "高", competition: "中", trend: "上升", score: 92, source: "AI推荐" },
  { name: "Oversized西装", demand: "很高", competition: "高", trend: "稳定", score: 88, source: "AI推荐" },
  { name: "厚底乐福鞋", demand: "高", competition: "低", trend: "上升", score: 95, source: "AI推荐" },
  { name: "网眼运动Legging", demand: "中", competition: "中", trend: "增长", score: 78, source: "AI推荐" },
];

// ERP数据源 - 热门商品
export const erpProductData = [
  { name: "瑜伽健身紧身裤", price: 35, sales: 23450, source: "妙手ERP", growth: "+156%", category: "运动裤" },
  { name: "复古宽松衬衫", price: 42, sales: 18760, source: "妙手ERP", growth: "+89%", category: "衬衫" },
  { name: "韩版宽松T恤", price: 28, sales: 34560, source: "妙手ERP", growth: "+124%", category: "T恤" },
  { name: "高腰休闲裤", price: 55, sales: 15670, source: "店小蜜ERP", growth: "+67%", category: "裤子" },
  { name: "休闲棒球服", price: 89, sales: 12340, source: "店小蜜ERP", growth: "+78%", category: "外套" },
  { name: "宽松套头衫", price: 65, sales: 19870, source: "易仓ERP", growth: "+95%", category: "上衣" },
  { name: "工装多口袋裤", price: 78, sales: 11230, source: "易仓ERP", growth: "+112%", category: "裤子" },
  { name: "设计师联名款", price: 156, sales: 8760, source: "通途ERP", growth: "+45%", category: "外套" },
  { name: "街头印花帽衫", price: 72, sales: 25670, source: "通途ERP", growth: "+167%", category: "帽衫" },
  { name: "复古水洗牛仔裤", price: 89, sales: 14320, source: "妙手ERP", growth: "+88%", category: "牛仔裤" },
];

// 竞品店铺数据
export const competitorStoreData = {
  amazon: [
    { name: "Nike官方旗舰店", products: 456, newProducts: 23, avgPrice: 89, followers: 2340000, trending: true },
    { name: "Adidas Originals", products: 389, newProducts: 18, avgPrice: 95, followers: 1890000, trending: true },
    { name: "Champion服饰", products: 234, newProducts: 12, avgPrice: 68, followers: 890000, trending: false },
    { name: "Supreme平替店", products: 567, newProducts: 45, avgPrice: 45, followers: 456000, trending: true },
  ],
  tiktok: [
    { name: "FashionNova", followers: 8900000, likes: 120000000, newVideos: 156, trendingProduct: "紧身连衣裙", trend: "上升" },
    { name: "Revolve", followers: 5600000, likes: 78000000, newVideos: 89, trendingProduct: "波西米亚长裙", trend: "稳定" },
    { name: "Zaful官方", followers: 3400000, likes: 45000000, newVideos: 234, trendingProduct: "泳装系列", trend: "上升" },
    { name: "Shein官方", followers: 12000000, likes: 234000000, newVideos: 567, trendingProduct: "蕾丝上衣", trend: "热门" },
  ],
  reddit: [
    { name: "r/streetwear", members: 890000, posts: 2340, topKeywords: ["oversized", "minimalist", "vintage"], active: true },
    { name: "r/fashion", members: 1200000, posts: 3456, topKeywords: ["sustainable", "luxury", "thrifted"], active: true },
    { name: "r/malefashion", members: 456000, posts: 1234, topKeywords: ["tailored", "smart-casual", "hermes"], active: true },
    { name: "r/womensfashion", members: 780000, posts: 2134, topKeywords: ["cottagecore", "y2k", "basics"], active: true },
  ],
};

// 竞品分析数据
export const competitorAnalysis = [
  { name: "竞品A-Nike代购", priceRange: "¥150-350", priceChanges: 12, newProducts: 23, topProducts: ["AJ1复刻", "Dunk系列", "卫衣"], lastUpdate: "2小时前", status: "活跃" },
  { name: "竞品B-Adidas授权", priceRange: "¥200-500", priceChanges: 8, newProducts: 15, topProducts: ["三叶草", "Ultraboost", "运动裤"], lastUpdate: "5小时前", status: "活跃" },
  { name: "竞品C-Under Armour", priceRange: "¥120-280", priceChanges: 5, newProducts: 8, topProducts: ["紧身衣", "健身服", "运动内衣"], lastUpdate: "1天前", status: "一般" },
  { name: "竞品D-Puma联名", priceRange: "¥180-400", priceChanges: 15, newProducts: 28, topProducts: ["硫化鞋", "复古运动", "配件"], lastUpdate: "3小时前", status: "非常活跃" },
];

// 关键词分析 - 按平台分类
export const platformKeywords = {
  amazon: [
    { keyword: "men's hoodie pullover", volume: 45600, competition: "高", difficulty: 82, trend: "稳定", adsBid: 2.45 },
    { keyword: "women's oversized tee", volume: 23400, competition: "中", difficulty: 55, trend: "上升", adsBid: 1.89 },
    { keyword: "cargo pants tactical", volume: 18900, competition: "高", difficulty: 75, trend: "增长", adsBid: 2.12 },
    { keyword: "vintage denim jacket men", volume: 12300, competition: "中", difficulty: 58, trend: "稳定", adsBid: 1.56 },
    { keyword: "streetwear sweatshirt", volume: 34500, competition: "高", difficulty: 78, trend: "上升", adsBid: 2.34 },
    { keyword: "athletic leggings women", volume: 56700, competition: "高", difficulty: 88, trend: "热门", adsBid: 2.89 },
  ],
  tiktok: [
    { keyword: "#streetwear", views: 450000000, posts: 2340000, trend: "上升", difficulty: 45 },
    { keyword: "#outfitinspiration", views: 890000000, posts: 5670000, trend: "热门", difficulty: 72 },
    { keyword: "#fashionhacks", views: 234000000, posts: 1230000, trend: "稳定", difficulty: 38 },
    { keyword: "#thriftedfinds", views: 167000000, posts: 890000, trend: "上升", difficulty: 35 },
    { keyword: "#minimaliststyle", views: 123000000, posts: 678000, trend: "增长", difficulty: 42 },
  ],
  reddit: [
    { keyword: "oversized fit", mentions: 4560, engagement: 8.9, trend: "上升", difficulty: 25 },
    { keyword: "sustainable fashion", mentions: 12340, engagement: 7.8, trend: "热门", difficulty: 55 },
    { keyword: "vintage thrifting", mentions: 8920, engagement: 8.2, trend: "稳定", difficulty: 40 },
    { keyword: "quality over quantity", mentions: 6780, engagement: 9.1, trend: "增长", difficulty: 30 },
  ],
};

// 关键词优化建议
export const keywordSuggestions = [
  { keyword: "streetwear hoodie", platform: "Amazon", suggestion: "推荐使用", reason: "搜索量大，竞争适中", priority: "高" },
  { keyword: "y2k aesthetic", platform: "TikTok", suggestion: "强烈推荐", reason: "趋势上升，流量红利期", priority: "高" },
  { keyword: "sustainable clothing", platform: "Reddit", suggestion: "推荐使用", reason: "用户讨论活跃，转化率高", priority: "中" },
  { keyword: "oversized streetwear", platform: "Amazon", suggestion: "推荐使用", reason: "搜索量上升中", priority: "高" },
  { keyword: "cozy athleisure", platform: "TikTok", suggestion: "可以尝试", reason: "细分市场，竞争较小", priority: "中" },
];

export const keywordAnalysis = [
  { keyword: "streetwear hoodie", volume: 24600, competition: "高", difficulty: 78, trend: "稳定" },
  { keyword: "urban fashion", volume: 18300, competition: "高", difficulty: 72, trend: "增长" },
  { keyword: "oversized tee", volume: 12400, competition: "中", difficulty: 55, trend: "上升" },
  { keyword: "cargo pants men", volume: 22100, competition: "高", difficulty: 82, trend: "稳定" },
  { keyword: "vintage denim jacket", volume: 8900, competition: "中", difficulty: 48, trend: "增长" },
];

// ========== 销量预测数据 ==========

// 历史销量数据（用于预测模型训练）
export const historicalSalesData = [
  { id: 1, name: "Oversized连帽卫衣", category: "Hoodies", month: "2025-01", sales: 3250, revenue: 113750, growth: 12, price: 35, source: "自营" },
  { id: 2, name: "Oversized连帽卫衣", category: "Hoodies", month: "2025-02", sales: 2890, revenue: 101150, growth: -11, price: 35, source: "自营" },
  { id: 3, name: "Oversized连帽卫衣", category: "Hoodies", month: "2025-03", sales: 4120, revenue: 144200, growth: 43, price: 35, source: "自营" },
  { id: 4, name: "Oversized连帽卫衣", category: "Hoodies", month: "2025-04", sales: 4560, revenue: 159600, growth: 11, price: 35, source: "自营" },
  { id: 5, name: "Oversized连帽卫衣", category: "Hoodies", month: "2025-05", sales: 5230, revenue: 183050, growth: 15, price: 35, source: "自营" },
  { id: 6, name: "Oversized连帽卫衣", category: "Hoodies", month: "2025-06", sales: 4890, revenue: 171150, growth: -6, price: 35, source: "自营" },
  { id: 7, name: "宽松落肩T恤", category: "T-Shirts", month: "2025-01", sales: 5680, revenue: 113600, growth: 8, price: 20, source: "自营" },
  { id: 8, name: "宽松落肩T恤", category: "T-Shirts", month: "2025-02", sales: 6120, revenue: 122400, growth: 8, price: 20, source: "自营" },
  { id: 9, name: "宽松落肩T恤", category: "T-Shirts", month: "2025-03", sales: 7650, revenue: 153000, growth: 25, price: 20, source: "自营" },
  { id: 10, name: "宽松落肩T恤", category: "T-Shirts", month: "2025-04", sales: 8230, revenue: 164600, growth: 8, price: 20, source: "自营" },
  { id: 11, name: "宽松落肩T恤", category: "T-Shirts", month: "2025-05", sales: 9120, revenue: 182400, growth: 11, price: 20, source: "自营" },
  { id: 12, name: "宽松落肩T恤", category: "T-Shirts", month: "2025-06", sales: 8870, revenue: 177400, growth: -3, price: 20, source: "自营" },
  { id: 13, name: "工装多袋裤", category: "Pants", month: "2025-01", sales: 2340, revenue: 140400, growth: 15, price: 60, source: "自营" },
  { id: 14, name: "工装多袋裤", category: "Pants", month: "2025-02", sales: 2560, revenue: 153600, growth: 9, price: 60, source: "自营" },
  { id: 15, name: "工装多袋裤", category: "Pants", month: "2025-03", sales: 3120, revenue: 187200, growth: 22, price: 60, source: "自营" },
  { id: 16, name: "工装多袋裤", category: "Pants", month: "2025-04", sales: 3450, revenue: 207000, growth: 11, price: 60, source: "自营" },
  { id: 17, name: "工装多袋裤", category: "Pants", month: "2025-05", sales: 3890, revenue: 233400, growth: 13, price: 60, source: "自营" },
  { id: 18, name: "工装多袋裤", category: "Pants", month: "2025-06", sales: 3670, revenue: 220200, growth: -6, price: 60, source: "自营" },
  { id: 19, name: "机能工装风衣", category: "Jackets", month: "2025-01", sales: 1230, revenue: 172200, growth: 5, price: 140, source: "自营" },
  { id: 20, name: "机能工装风衣", category: "Jackets", month: "2025-02", sales: 1450, revenue: 203000, growth: 18, price: 140, source: "自营" },
  { id: 21, name: "机能工装风衣", category: "Jackets", month: "2025-03", sales: 2890, revenue: 404600, growth: 99, price: 140, source: "自营" },
  { id: 22, name: "机能工装风衣", category: "Jackets", month: "2025-04", sales: 4560, revenue: 638400, growth: 58, price: 140, source: "自营" },
  { id: 23, name: "机能工装风衣", category: "Jackets", month: "2025-05", sales: 5230, revenue: 732200, growth: 15, price: 140, source: "自营" },
  { id: 24, name: "机能工装风衣", category: "Jackets", month: "2025-06", sales: 4890, revenue: 684600, growth: -7, price: 140, source: "自营" },
  { id: 25, name: "高腰瑜伽裤", category: "Leggings", month: "2025-01", sales: 4560, revenue: 91200, growth: 10, price: 20, source: "自营" },
  { id: 26, name: "高腰瑜伽裤", category: "Leggings", month: "2025-02", sales: 4890, revenue: 97800, growth: 7, price: 20, source: "自营" },
  { id: 27, name: "高腰瑜伽裤", category: "Leggings", month: "2025-03", sales: 5340, revenue: 106800, growth: 9, price: 20, source: "自营" },
  { id: 28, name: "高腰瑜伽裤", category: "Leggings", month: "2025-04", sales: 5780, revenue: 115600, growth: 8, price: 20, source: "自营" },
  { id: 29, name: "高腰瑜伽裤", category: "Leggings", month: "2025-05", sales: 6120, revenue: 122400, growth: 6, price: 20, source: "自营" },
  { id: 30, name: "高腰瑜伽裤", category: "Leggings", month: "2025-06", sales: 5890, revenue: 117800, growth: -4, price: 20, source: "自营" },
];

// 友商销量数据（用于对标分析）
export const competitorSalesData = [
  { competitor: "竞店A-潮牌旗舰店", category: "Hoodies", month: "2025-05", sales: 8900, marketShare: 15.2, growth: 23, avgPrice: 38 },
  { competitor: "竞店A-潮牌旗舰店", category: "Hoodies", month: "2025-06", sales: 8200, marketShare: 14.1, growth: -8, avgPrice: 38 },
  { competitor: "竞店B-街头风服饰", category: "Hoodies", month: "2025-05", sales: 5600, marketShare: 9.6, growth: 12, avgPrice: 32 },
  { competitor: "竞店B-街头风服饰", category: "Hoodies", month: "2025-06", sales: 6100, marketShare: 10.5, growth: 9, avgPrice: 32 },
  { competitor: "竞店C-运动户外", category: "Hoodies", month: "2025-05", sales: 12300, marketShare: 21.0, growth: 35, avgPrice: 45 },
  { competitor: "竞店C-运动户外", category: "Hoodies", month: "2025-06", sales: 11500, marketShare: 19.7, growth: -7, avgPrice: 45 },
  { competitor: "竞店A-潮牌旗舰店", category: "T-Shirts", month: "2025-05", sales: 12000, marketShare: 18.5, growth: 15, avgPrice: 22 },
  { competitor: "竞店B-街头风服饰", category: "T-Shirts", month: "2025-05", sales: 8900, marketShare: 13.7, growth: 8, avgPrice: 18 },
  { competitor: "竞店C-运动户外", category: "T-Shirts", month: "2025-05", sales: 15600, marketShare: 24.0, growth: 28, avgPrice: 25 },
  { competitor: "竞店A-潮牌旗舰店", category: "Jackets", month: "2025-05", sales: 7800, marketShare: 12.3, growth: 45, avgPrice: 150 },
  { competitor: "竞店B-街头风服饰", category: "Jackets", month: "2025-05", sales: 4500, marketShare: 7.1, growth: 22, avgPrice: 120 },
  { competitor: "竞店C-运动户外", category: "Jackets", month: "2025-05", sales: 18900, marketShare: 29.8, growth: 56, avgPrice: 160 },
];

// 行业趋势数据
export const industryTrendData = {
  "Hoodies": {
    marketSize: 58000000, // 市场规模（月）
    growthRate: 12.5,
    seasonality: ["9月-2月旺季", "3月-8月淡季"],
    peakMonth: "12月",
    avgPrice: 38,
    topKeywords: ["oversized hoodie", "streetwear hoodie", "graphic hoodie"],
    consumerTags: ["Z世代", "大学生", "潮流男生"]
  },
  "T-Shirts": {
    marketSize: 82000000,
    growthRate: 8.3,
    seasonality: ["全年平稳", "4月-9月略高"],
    peakMonth: "6月",
    avgPrice: 22,
    topKeywords: ["oversized tee", "graphic tee", "minimalist tee"],
    consumerTags: ["年轻人", "健身人群", "日常通勤"]
  },
  "Pants": {
    marketSize: 65000000,
    growthRate: 15.2,
    seasonality: ["全年销售", "换季高峰期"],
    peakMonth: "3月,9月",
    avgPrice: 55,
    topKeywords: ["cargo pants", "streetwear pants", "loose fit"],
    consumerTags: ["潮流男生", "大学生", "职场新人"]
  },
  "Jackets": {
    marketSize: 45000000,
    growthRate: 18.7,
    seasonality: ["9月-3月旺季"],
    peakMonth: "11月",
    avgPrice: 145,
    topKeywords: ["windbreaker", "varsity jacket", "cargo jacket"],
    consumerTags: ["潮流男生", "户外运动", "城市通勤"]
  },
  "Leggings": {
    marketSize: 38000000,
    growthRate: 22.1,
    seasonality: ["全年销售", "冬季略低"],
    peakMonth: "1月,5月",
    avgPrice: 18,
    topKeywords: ["high waisted leggings", "yoga pants", "workout leggings"],
    consumerTags: ["健身女生", "瑜伽爱好者", "大学生"]
  }
};

// 预测因子权重配置
export const forecastWeightConfig = {
  historicalTrend: 0.25,    // 历史趋势权重
  competitorData: 0.20,    // 友商数据权重
  marketTrend: 0.20,       // 市场需求趋势权重
  seasonality: 0.15,       // 季节性权重
  priceFactor: 0.10,        // 价格因素权重
  socialTrend: 0.10,       // 社交媒体热度权重
};