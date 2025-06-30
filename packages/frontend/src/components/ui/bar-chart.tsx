"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter: (value: number) => string;
  yAxisWidth?: number;
}

export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  yAxisWidth = 56,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <XAxis
          dataKey={index}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={yAxisWidth}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload) return null;

            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  {payload.map((category, i) => (
                    <div key={category.name} className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {category.name}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {valueFormatter(category.value as number)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
} 