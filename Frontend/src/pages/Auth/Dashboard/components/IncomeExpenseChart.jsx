import {TrendingUp} from "lucide-react"
import {Label, Pie, PieChart, Cell} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function IncomeExpenseChart({data}) {
  const income = data?.Income || 0
  const expense = data?.Expense || 0
  const remainingIncome = income - expense

  const chartData = [
    {name: "Expense", value: expense, fill: "#f97316"},
    {name: "Remaining Income", value: remainingIncome, fill: "#475569"},
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl text-slate-800">
          Income vs Expense
        </CardTitle>
        <CardDescription className="text-base">
          Current Month Financial Overview
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[250px]"
          config={{}}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({viewBox}) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ₹
                          {income.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                            notation: "compact",
                            compactDisplay: "short",
                          })}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Income
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-5 text-base">
        <div className="flex items-center gap-2 font-medium leading-none text-slate-700">
          Financial Overview for This Month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground text-base">
          <span className="text-green-600 font-semibold">Income:</span> ₹
          {income?.toLocaleString() || 0}
          <span className="mx-2">|</span>
          <span className="text-red-600 font-semibold">Expense:</span> ₹
          {expense?.toLocaleString() || 0}
        </div>
      </CardFooter>
    </Card>
  )
}
