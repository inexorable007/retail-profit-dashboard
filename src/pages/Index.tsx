import { useState, useMemo } from "react";
import { IndianRupee, TrendingUp, Percent, ShoppingCart, Filter, Info } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell, PieChart, Pie,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KPICard from "@/components/KPICard";
import InsightsPanel from "@/components/InsightsPanel";
import {
  retailData, getKPIs, getRegionPerformance, getMonthlySalesTrend,
  getCategoryPerformance, getTopBottomProducts, getDiscountImpact,
  getSegmentPerformance, getSubCategoryPerformance, SalesRecord,
  formatINRShort,
} from "@/data/retailData";

// ============================================================
// INR Formatting for Charts
// ============================================================
const fmtAxis = (v: number) => {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(1)}Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(0)}L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(0)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
};

const COLORS = {
  blue: "hsl(199, 89%, 48%)",
  green: "hsl(160, 84%, 39%)",
  amber: "hsl(38, 92%, 50%)",
  red: "hsl(0, 72%, 51%)",
  purple: "hsl(262, 83%, 58%)",
  teal: "hsl(172, 66%, 50%)",
};

const regionColors: Record<string, string> = {
  East: COLORS.blue,
  West: COLORS.green,
  Central: COLORS.amber,
  South: COLORS.purple,
};

// ============================================================
// Chart Card with description for beginners
// ============================================================
const ChartCard = ({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>
    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
    {description && (
      <p className="mb-3 flex items-start gap-1 text-[10px] leading-relaxed text-muted-foreground/70">
        <Info className="h-3 w-3 mt-0.5 shrink-0" />
        {description}
      </p>
    )}
    {children}
  </div>
);

// ============================================================
// Custom Tooltip — shows values in INR
// ============================================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" && !p.name.includes("Margin") ? formatINRShort(p.value) : `${p.value}%`}
        </p>
      ))}
    </div>
  );
};

// ============================================================
// Main Dashboard Component
// ============================================================
const Index = () => {
  const [regionFilter, setRegionFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");

  const filteredData = useMemo(() => {
    let data: SalesRecord[] = retailData;
    if (regionFilter !== "all") data = data.filter((r) => r.region === regionFilter);
    if (categoryFilter !== "all") data = data.filter((r) => r.category === categoryFilter);
    if (segmentFilter !== "all") data = data.filter((r) => r.segment === segmentFilter);
    return data;
  }, [regionFilter, categoryFilter, segmentFilter]);

  const kpis = useMemo(() => getKPIs(filteredData), [filteredData]);
  const regionPerf = useMemo(() => getRegionPerformance(filteredData), [filteredData]);
  const monthlyTrend = useMemo(() => getMonthlySalesTrend(filteredData), [filteredData]);
  const categoryPerf = useMemo(() => getCategoryPerformance(filteredData), [filteredData]);
  const { top, bottom } = useMemo(() => getTopBottomProducts(filteredData, 5), [filteredData]);
  const discountImpact = useMemo(() => getDiscountImpact(filteredData), [filteredData]);
  const segmentPerf = useMemo(() => getSegmentPerformance(filteredData), [filteredData]);
  const subCatPerf = useMemo(() => getSubCategoryPerformance(filteredData), [filteredData]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">Retail Business Intelligence</h1>
          <p className="text-xs text-muted-foreground">Profit Optimization System · 2023-2024 Analysis · All values in ₹ (INR)</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Region" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {["East", "West", "Central", "South"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {["Technology", "Furniture", "Office Supplies"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Segment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              {["Consumer", "Corporate", "Home Office"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard
          title="Total Sales"
          value={formatINRShort(kpis.totalSales)}
          subtitle={`${kpis.totalOrders.toLocaleString("en-IN")} orders`}
          tooltip="Total revenue generated from all product sales across all regions and categories."
          icon={IndianRupee}
          glowClass="kpi-glow-sales"
          iconColorClass="text-kpi-sales"
        />
        <KPICard
          title="Total Profit"
          value={formatINRShort(kpis.totalProfit)}
          subtitle={kpis.totalProfit >= 0 ? "Net positive" : "⚠️ Net loss"}
          tooltip="Revenue minus all costs. Low profit despite high sales indicates margin erosion from discounts."
          icon={TrendingUp}
          glowClass="kpi-glow-profit"
          iconColorClass="text-kpi-profit"
        />
        <KPICard
          title="Profit Margin"
          value={`${kpis.profitMargin.toFixed(1)}%`}
          subtitle={kpis.profitMargin < 10 ? "⚠️ Below target (10%)" : "✅ On target"}
          tooltip="Percentage of sales that becomes profit. Industry target is 10-12%. Below 10% signals a problem."
          icon={Percent}
          glowClass="kpi-glow-margin"
          iconColorClass="text-kpi-margin"
        />
        <KPICard
          title="Avg Order Value"
          value={formatINRShort(kpis.totalSales / kpis.totalOrders)}
          subtitle="Per transaction"
          tooltip="Average revenue per order. Higher AOV with good margins = healthy business."
          icon={ShoppingCart}
          glowClass="kpi-glow-orders"
          iconColorClass="text-kpi-orders"
        />
      </div>

      {/* Row 1: Monthly Trend + Region Performance */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Monthly Sales & Profit Trend"
          description="Shows monthly revenue and profit over 24 months. Notice how profit stays low despite rising sales — a sign of margin erosion."
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 20%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} tickFormatter={(v) => v.substring(5)} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} tickFormatter={fmtAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="sales" name="Sales" stroke={COLORS.blue} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="profit" name="Profit" stroke={COLORS.green} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Region Performance"
          description="Compares sales vs profit by region. Central has high sales but weak profit due to excessive discounting."
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={regionPerf} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 20%)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} tickFormatter={fmtAxis} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="sales" name="Sales" radius={[0, 4, 4, 0]}>
                {regionPerf.map((entry) => <Cell key={entry.region} fill={regionColors[entry.region]} fillOpacity={0.7} />)}
              </Bar>
              <Bar dataKey="profit" name="Profit" radius={[0, 4, 4, 0]}>
                {regionPerf.map((entry) => (
                  <Cell key={entry.region} fill={entry.profit >= 0 ? regionColors[entry.region] : COLORS.red} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Category + Segment + Discount */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <ChartCard
          title="Category Performance"
          description="Sales distribution by category with profit margin %. Furniture has the lowest margins."
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryPerf} dataKey="sales" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, margin }) => `${category} (${margin}%)`} labelLine={{ stroke: "hsl(215, 15%, 55%)" }} fontSize={10}>
                <Cell fill={COLORS.blue} />
                <Cell fill={COLORS.amber} />
                <Cell fill={COLORS.green} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Segment Contribution"
          description="Revenue and profit by customer type. Corporate has the best per-order profitability."
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={segmentPerf}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 20%)" />
              <XAxis dataKey="segment" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} tickFormatter={fmtAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" name="Sales" fill={COLORS.purple} radius={[4, 4, 0, 0]} fillOpacity={0.7} />
              <Bar dataKey="profit" name="Profit" fill={COLORS.teal} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Discount Impact on Profit"
          description="Shows how discounts affect profit. Green = profit, Red = loss. Notice profit turns negative above 20% discount."
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={discountImpact}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 20%)" />
              <XAxis dataKey="bucket" tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} tickFormatter={fmtAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="profit" name="Profit" radius={[4, 4, 0, 0]}>
                {discountImpact.map((entry, i) => (
                  <Cell key={i} fill={entry.profit >= 0 ? COLORS.green : COLORS.red} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Sub-Category + Top/Bottom products */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Sub-Category Profitability"
          description="Ranked from most loss-making to most profitable. Red bars = negative profit (loss). Green bars = positive profit."
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={subCatPerf} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 20%)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} tickFormatter={fmtAxis} />
              <YAxis dataKey="subCategory" type="category" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="profit" name="Profit" radius={[0, 4, 4, 0]}>
                {subCatPerf.map((entry, i) => (
                  <Cell key={i} fill={entry.profit >= 0 ? COLORS.green : COLORS.red} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="space-y-4">
          <ChartCard
            title="Top 5 Products by Profit"
            description="Most profitable products. These are strong performers to double-down on."
          >
            <div className="space-y-2">
              {top.map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-accent/10 border border-accent/20 px-3 py-2">
                  <span className="text-xs font-medium truncate max-w-[60%]">{p.name}</span>
                  <span className="text-xs font-semibold text-accent">{formatINRShort(p.profit)}</span>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard
            title="Bottom 5 Products (Loss-Making)"
            description="Products losing money. Consider discontinuing or removing discounts on these."
          >
            <div className="space-y-2">
              {bottom.map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                  <span className="text-xs font-medium truncate max-w-[60%]">{p.name}</span>
                  <span className="text-xs font-semibold text-destructive">{formatINRShort(p.profit)}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Insights & Recommendations & Interview Section */}
      <div className="mb-6">
        <InsightsPanel />
      </div>

      <footer className="pb-4 text-center text-xs text-muted-foreground">
        Retail BI & Profit Optimization System · Data Analyst Portfolio Project · All values in ₹ (INR)
      </footer>
    </div>
  );
};

export default Index;
