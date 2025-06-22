
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: any[];
  type?: 'line' | 'bar';
  dataKey: string;
  xAxisKey: string;
}

export const AnalyticsChart = ({ 
  title, 
  description, 
  data, 
  type = 'line', 
  dataKey, 
  xAxisKey 
}: AnalyticsChartProps) => {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <DataComponent 
              dataKey={dataKey} 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))"
              strokeWidth={2}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
