// Simulated Superstore-style retail dataset (Indian Retail Market)
// Values in Indian Rupees (₹) — converted at 1 USD = ₹90
// This mirrors real-world patterns: high sales but low profit in certain segments

export interface SalesRecord {
  id: string;
  orderDate: string;
  region: string;
  state: string;
  category: string;
  subCategory: string;
  productName: string;
  sales: number;      // In INR (₹)
  quantity: number;
  discount: number;
  profit: number;     // In INR (₹)
  segment: string;
}

// USD to INR conversion rate
const USD_TO_INR = 90;

const regions = ["East", "West", "Central", "South"];
const segments = ["Consumer", "Corporate", "Home Office"];
const categories = ["Technology", "Furniture", "Office Supplies"];

const subCategories: Record<string, string[]> = {
  Technology: ["Phones", "Accessories", "Copiers", "Machines"],
  Furniture: ["Chairs", "Tables", "Bookcases", "Furnishings"],
  "Office Supplies": ["Storage", "Binders", "Art", "Paper", "Envelopes", "Labels", "Fasteners", "Supplies"],
};

const statesByRegion: Record<string, string[]> = {
  East: ["West Bengal", "Odisha", "Bihar", "Jharkhand", "Assam"],
  West: ["Maharashtra", "Gujarat", "Rajasthan", "Goa", "Madhya Pradesh"],
  Central: ["Uttar Pradesh", "Madhya Pradesh", "Chhattisgarh", "Delhi", "Haryana"],
  South: ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Telangana"],
};

const profitabilityProfile: Record<string, { marginRange: [number, number]; discountSensitivity: number }> = {
  Phones: { marginRange: [0.08, 0.18], discountSensitivity: 2.5 },
  Accessories: { marginRange: [0.15, 0.35], discountSensitivity: 1.2 },
  Copiers: { marginRange: [0.20, 0.40], discountSensitivity: 1.0 },
  Machines: { marginRange: [-0.10, 0.15], discountSensitivity: 3.0 },
  Chairs: { marginRange: [0.02, 0.12], discountSensitivity: 2.0 },
  Tables: { marginRange: [-0.20, 0.05], discountSensitivity: 3.5 },
  Bookcases: { marginRange: [-0.15, 0.10], discountSensitivity: 2.8 },
  Furnishings: { marginRange: [0.10, 0.25], discountSensitivity: 1.5 },
  Storage: { marginRange: [0.05, 0.15], discountSensitivity: 1.8 },
  Binders: { marginRange: [0.15, 0.40], discountSensitivity: 1.0 },
  Art: { marginRange: [0.10, 0.30], discountSensitivity: 1.2 },
  Paper: { marginRange: [0.20, 0.45], discountSensitivity: 0.8 },
  Envelopes: { marginRange: [0.15, 0.35], discountSensitivity: 1.0 },
  Labels: { marginRange: [0.20, 0.40], discountSensitivity: 0.9 },
  Fasteners: { marginRange: [0.10, 0.30], discountSensitivity: 1.1 },
  Supplies: { marginRange: [0.05, 0.20], discountSensitivity: 1.5 },
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateData(): SalesRecord[] {
  const records: SalesRecord[] = [];
  let seed = 42;

  for (let month = 0; month < 24; month++) {
    const year = 2023 + Math.floor(month / 12);
    const m = (month % 12) + 1;
    const ordersThisMonth = 40 + Math.floor(seededRandom(seed++) * 30);

    for (let i = 0; i < ordersThisMonth; i++) {
      const region = regions[Math.floor(seededRandom(seed++) * regions.length)];
      const segment = segments[Math.floor(seededRandom(seed++) * segments.length)];
      const category = categories[Math.floor(seededRandom(seed++) * categories.length)];
      const subs = subCategories[category];
      const subCategory = subs[Math.floor(seededRandom(seed++) * subs.length)];
      const state = statesByRegion[region][Math.floor(seededRandom(seed++) * statesByRegion[region].length)];
      const day = 1 + Math.floor(seededRandom(seed++) * 28);

      // Generate base sales in USD, then convert to INR
      const baseSalesUSD = 50 + seededRandom(seed++) * 2000;
      const quantity = 1 + Math.floor(seededRandom(seed++) * 8);
      const salesINR = Math.round(baseSalesUSD * quantity * USD_TO_INR * 100) / 100;

      // Discounts: Central region gives more discounts (problem area)
      let discount = 0;
      const discRand = seededRandom(seed++);
      if (region === "Central") {
        discount = discRand < 0.3 ? 0 : discRand < 0.5 ? 0.2 : discRand < 0.7 ? 0.3 : 0.4;
      } else if (region === "South") {
        discount = discRand < 0.4 ? 0 : discRand < 0.7 ? 0.1 : 0.2;
      } else {
        discount = discRand < 0.5 ? 0 : discRand < 0.8 ? 0.1 : 0.15;
      }

      const profile = profitabilityProfile[subCategory];
      const baseMargin = profile.marginRange[0] + seededRandom(seed++) * (profile.marginRange[1] - profile.marginRange[0]);
      const adjustedMargin = baseMargin - discount * profile.discountSensitivity;
      const profitINR = Math.round(salesINR * adjustedMargin * 100) / 100;

      const productName = `${subCategory} - ${String.fromCharCode(65 + Math.floor(seededRandom(seed++) * 10))}${Math.floor(seededRandom(seed++) * 100)}`;

      records.push({
        id: `ORD-${year}${String(m).padStart(2, "0")}${String(i).padStart(3, "0")}`,
        orderDate: `${year}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        region,
        state,
        category,
        subCategory,
        productName,
        sales: salesINR,
        quantity,
        discount,
        profit: profitINR,
        segment,
      });
    }
  }

  return records;
}

export const retailData = generateData();

// ============================================================
// INR Currency Formatter — Indian numbering system
// ============================================================
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrFormatterShort = (n: number): string => {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(2)} L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(1)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
};

export const formatINR = inrFormatter.format.bind(inrFormatter);
export const formatINRShort = inrFormatterShort;

// ============================================================
// Derived Analytics Functions
// ============================================================
export function getKPIs(data: SalesRecord[]) {
  const totalSales = data.reduce((s, r) => s + r.sales, 0);
  const totalProfit = data.reduce((s, r) => s + r.profit, 0);
  const totalOrders = data.length;
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  return { totalSales, totalProfit, totalOrders, profitMargin };
}

export function getRegionPerformance(data: SalesRecord[]) {
  const map = new Map<string, { sales: number; profit: number; orders: number }>();
  data.forEach((r) => {
    const cur = map.get(r.region) || { sales: 0, profit: 0, orders: 0 };
    cur.sales += r.sales;
    cur.profit += r.profit;
    cur.orders += 1;
    map.set(r.region, cur);
  });
  return Array.from(map.entries()).map(([region, v]) => ({
    region,
    sales: Math.round(v.sales),
    profit: Math.round(v.profit),
    margin: v.sales > 0 ? +((v.profit / v.sales) * 100).toFixed(1) : 0,
    orders: v.orders,
  }));
}

export function getMonthlySalesTrend(data: SalesRecord[]) {
  const map = new Map<string, { sales: number; profit: number }>();
  data.forEach((r) => {
    const key = r.orderDate.substring(0, 7);
    const cur = map.get(key) || { sales: 0, profit: 0 };
    cur.sales += r.sales;
    cur.profit += r.profit;
    map.set(key, cur);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month,
      sales: Math.round(v.sales),
      profit: Math.round(v.profit),
    }));
}

export function getCategoryPerformance(data: SalesRecord[]) {
  const map = new Map<string, { sales: number; profit: number; orders: number }>();
  data.forEach((r) => {
    const cur = map.get(r.category) || { sales: 0, profit: 0, orders: 0 };
    cur.sales += r.sales;
    cur.profit += r.profit;
    cur.orders += 1;
    map.set(r.category, cur);
  });
  return Array.from(map.entries()).map(([category, v]) => ({
    category,
    sales: Math.round(v.sales),
    profit: Math.round(v.profit),
    margin: v.sales > 0 ? +((v.profit / v.sales) * 100).toFixed(1) : 0,
    orders: v.orders,
  }));
}

export function getTopBottomProducts(data: SalesRecord[], count = 10) {
  const map = new Map<string, { sales: number; profit: number; quantity: number }>();
  data.forEach((r) => {
    const cur = map.get(r.productName) || { sales: 0, profit: 0, quantity: 0 };
    cur.sales += r.sales;
    cur.profit += r.profit;
    cur.quantity += r.quantity;
    map.set(r.productName, cur);
  });
  const products = Array.from(map.entries()).map(([name, v]) => ({
    name,
    sales: Math.round(v.sales),
    profit: Math.round(v.profit),
    quantity: v.quantity,
  }));
  const sorted = products.sort((a, b) => b.profit - a.profit);
  return {
    top: sorted.slice(0, count),
    bottom: sorted.slice(-count).reverse(),
  };
}

export function getDiscountImpact(data: SalesRecord[]) {
  const buckets = [
    { label: "No Discount", min: 0, max: 0 },
    { label: "1-10%", min: 0.01, max: 0.1 },
    { label: "11-20%", min: 0.11, max: 0.2 },
    { label: "21-30%", min: 0.21, max: 0.3 },
    { label: "31%+", min: 0.31, max: 1 },
  ];
  return buckets.map((b) => {
    const filtered = data.filter((r) => r.discount >= b.min && r.discount <= b.max);
    const sales = filtered.reduce((s, r) => s + r.sales, 0);
    const profit = filtered.reduce((s, r) => s + r.profit, 0);
    return {
      bucket: b.label,
      sales: Math.round(sales),
      profit: Math.round(profit),
      margin: sales > 0 ? +((profit / sales) * 100).toFixed(1) : 0,
      orders: filtered.length,
    };
  });
}

export function getSegmentPerformance(data: SalesRecord[]) {
  const map = new Map<string, { sales: number; profit: number; orders: number }>();
  data.forEach((r) => {
    const cur = map.get(r.segment) || { sales: 0, profit: 0, orders: 0 };
    cur.sales += r.sales;
    cur.profit += r.profit;
    cur.orders += 1;
    map.set(r.segment, cur);
  });
  return Array.from(map.entries()).map(([segment, v]) => ({
    segment,
    sales: Math.round(v.sales),
    profit: Math.round(v.profit),
    margin: v.sales > 0 ? +((v.profit / v.sales) * 100).toFixed(1) : 0,
    orders: v.orders,
  }));
}

export function getSubCategoryPerformance(data: SalesRecord[]) {
  const map = new Map<string, { sales: number; profit: number; orders: number; avgDiscount: number; discountCount: number }>();
  data.forEach((r) => {
    const cur = map.get(r.subCategory) || { sales: 0, profit: 0, orders: 0, avgDiscount: 0, discountCount: 0 };
    cur.sales += r.sales;
    cur.profit += r.profit;
    cur.orders += 1;
    cur.avgDiscount += r.discount;
    cur.discountCount += 1;
    map.set(r.subCategory, cur);
  });
  return Array.from(map.entries())
    .map(([subCategory, v]) => ({
      subCategory,
      sales: Math.round(v.sales),
      profit: Math.round(v.profit),
      margin: v.sales > 0 ? +((v.profit / v.sales) * 100).toFixed(1) : 0,
      avgDiscount: +((v.avgDiscount / v.discountCount) * 100).toFixed(1),
      orders: v.orders,
    }))
    .sort((a, b) => a.profit - b.profit);
}
