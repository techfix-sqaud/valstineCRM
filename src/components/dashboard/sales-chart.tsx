
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useTheme } from "@/hooks/use-theme";

const data = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 2390 },
  { month: "Jul", sales: 3490 },
  { month: "Aug", sales: 4000 },
  { month: "Sep", sales: 2000 },
  { month: "Oct", sales: 2780 },
  { month: "Nov", sales: 3890 },
  { month: "Dec", sales: 4490 },
];

export function SalesChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const textColor = isDark ? "#cbd5e1" : "#64748b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const barColor = "#2563eb";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: textColor }} 
                stroke={textColor}
              />
              <YAxis 
                tick={{ fill: textColor }} 
                stroke={textColor} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "#1e293b" : "#ffffff",
                  color: textColor,
                  border: isDark ? "1px solid #475569" : "1px solid #cbd5e1"
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill={barColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
