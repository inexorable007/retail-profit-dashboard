import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  tooltip: string;
  icon: LucideIcon;
  glowClass: string;
  iconColorClass: string;
}

const KPICard = ({ title, value, subtitle, tooltip, icon: Icon, glowClass, iconColorClass }: KPICardProps) => (
  <div className={`rounded-xl border border-border bg-card p-5 ${glowClass} transition-all hover:scale-[1.02] group relative`}>
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className={`rounded-lg bg-secondary p-2 ${iconColorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
    <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    {/* Tooltip on hover */}
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 w-56">
      <div className="rounded-lg border border-border bg-popover p-2 text-xs text-popover-foreground shadow-xl">
        {tooltip}
      </div>
    </div>
  </div>
);

export default KPICard;
