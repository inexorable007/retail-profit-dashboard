import { AlertTriangle, TrendingDown, TrendingUp, Target, Lightbulb, BookOpen } from "lucide-react";

interface Insight {
  type: "warning" | "negative" | "positive" | "action" | "recommendation";
  title: string;
  description: string;
}

// ============================================================
// BUSINESS INSIGHTS — Written for interview-readiness
// Clear, professional, data-backed statements
// ============================================================
const insights: Insight[] = [
  {
    type: "negative",
    title: "High Sales ≠ High Profit — The Core Problem",
    description:
      "Despite generating over ₹20 Cr in revenue, profit margins remain at just 5-8%. The root cause is aggressive discounting — particularly in the Central region and Furniture category — which erodes margins faster than sales volume can compensate.",
  },
  {
    type: "negative",
    title: "Discounts >20% Are Destroying Profitability",
    description:
      "High discounting (>20%) is the primary reason for negative profit margins, especially in Furniture category. Every ₹1 of additional discount above 20% causes ₹2-3 in profit loss due to high discount sensitivity in Tables, Bookcases, and Machines.",
  },
  {
    type: "warning",
    title: "Central Region: Highest Discounts, Lowest Profits",
    description:
      "Central region applies average discounts of 20-40% — nearly double the East and West regions (5-15%). This makes Central the least profitable region despite healthy order volumes. Discount approval processes need immediate review.",
  },
  {
    type: "negative",
    title: "Tables, Bookcases & Machines Are Loss-Making Products",
    description:
      "These three sub-categories consistently generate negative profits. Tables have margins of -5% to -20%, Bookcases have discount sensitivity of 2.8x (a 10% discount reduces margin by 28 points), and Machines lose money at any discount above 15%.",
  },
  {
    type: "positive",
    title: "Technology (Accessories & Copiers) Drives Most Profit",
    description:
      "Technology Accessories and Copiers maintain 20-40% margins even with moderate discounts. These are the strongest profit drivers. Paper, Labels, and Binders also perform well with margins above 15%. Focus marketing spend here.",
  },
  {
    type: "positive",
    title: "Corporate Segment Has Best Per-Order Profitability",
    description:
      "While Consumer segment contributes ~50% of revenue, Corporate segment delivers the best per-order profitability due to larger order sizes and controlled pricing. Home Office has the smallest volume but healthiest margins.",
  },
];

// ============================================================
// ACTIONABLE RECOMMENDATIONS
// ============================================================
const recommendations: Insight[] = [
  {
    type: "recommendation",
    title: "Cap All Discounts at 20% — Immediate Action",
    description:
      "Implement a hard 20% discount ceiling company-wide. For loss-making categories (Tables, Bookcases), reduce max discount to 10%. Expected impact: +2-3% improvement in overall profit margin, translating to ₹40-60L additional annual profit.",
  },
  {
    type: "recommendation",
    title: "Audit & Fix Central Region Discount Practices",
    description:
      "Conduct quarterly audits of discount approvals in Central region. Require senior management sign-off for any discount above 15%. Implement automated alerts when regional discount averages exceed 20%.",
  },
  {
    type: "recommendation",
    title: "Remove or Reprice Loss-Making Products",
    description:
      "Products with 3+ consecutive quarters of negative profit should be reviewed for discontinuation or repricing. Set minimum price floors at landed cost + 5% margin. Focus inventory on high-margin Technology products.",
  },
  {
    type: "recommendation",
    title: "Shift Marketing Budget to High-Profit Categories",
    description:
      "Reallocate 30% of Furniture marketing budget to Technology Accessories and Copiers. Implement tiered volume pricing instead of flat percentage discounts to protect per-unit margins while rewarding large orders.",
  },
];

const iconMap = {
  warning: AlertTriangle,
  negative: TrendingDown,
  positive: TrendingUp,
  action: Target,
  recommendation: Lightbulb,
};

const colorMap = {
  warning: "text-chart-amber border-l-chart-amber",
  negative: "text-destructive border-l-destructive",
  positive: "text-accent border-l-accent",
  action: "text-primary border-l-primary",
  recommendation: "text-primary border-l-primary",
};

const bgMap = {
  warning: "",
  negative: "bg-destructive/5",
  positive: "bg-accent/5",
  action: "",
  recommendation: "bg-primary/5",
};

const InsightCard = ({ insight, index }: { insight: Insight; index: number }) => {
  const Icon = iconMap[insight.type];
  const colors = colorMap[insight.type];
  const bg = bgMap[insight.type];
  return (
    <div className={`rounded-lg border border-border bg-card p-4 border-l-4 ${colors.split(" ")[1]} ${bg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colors.split(" ")[0]}`} />
        <div>
          <p className="text-sm font-semibold">{insight.title}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  );
};

const InsightsPanel = () => (
  <div className="space-y-6">
    {/* Key Findings */}
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-destructive" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Key Business Findings
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Data-driven insights explaining why profit is low despite high sales volume.
      </p>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} index={i} />
        ))}
      </div>
    </div>

    {/* Recommendations */}
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Actionable Recommendations
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Clear, implementable strategies to improve profitability by 3-5 percentage points.
      </p>
      <div className="space-y-2">
        {recommendations.map((rec, i) => (
          <InsightCard key={i} insight={rec} index={i} />
        ))}
      </div>
    </div>

 
  </div>
);

export default InsightsPanel;
