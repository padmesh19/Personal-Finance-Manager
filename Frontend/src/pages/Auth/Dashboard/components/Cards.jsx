import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {ArrowDownCircle, ArrowUpCircle, Target, Wallet} from "lucide-react"

const data = [
  {
    title: "Income",
    textColor: "#00cc7a",
    icon: <ArrowDownCircle color="#00cc7a" size={60} />,
    description: "Total earnings for the current month.",
  },
  {
    title: "Expense",
    textColor: "#e60000",
    icon: <ArrowUpCircle color="#e60000" size={60} />,
    description: "Total amount spent this month.",
  },
  {
    title: "Goals",
    textColor: "#ff9933",
    icon: <Target color="#ff9933" size={60} />,
    description: "Number of financial goals set.",
  },
  {
    title: "Budget",
    textColor: "#7300e6",
    icon: <Wallet color="#7300e6" size={60} />,
    description: "Total budget allocated for this month.",
  },
]

const Cards = ({item}) => {
  const getData = data.find(i => i.title === item.key)
  return (
    <Card className="w-[29%] border-0 shadow-md px-4 h-[180px]">
      <CardHeader className="flex justify-between items-start flex-row">
        <div className="flex flex-col gap-2">
          <CardTitle
            style={{color: getData?.textColor}}
            className="font-normal text-lg"
          >
            {item.key}
          </CardTitle>
          <CardDescription className="text-slate-700 text-xl font-medium">
            {item?.value !== undefined && item?.value !== null
              ? item.key === "Expense" || item.key === "Income"
                ? "₹ " + Number(item.value || 0).toLocaleString()
                : Number(item.value || 0).toLocaleString()
              : "N/A"}
          </CardDescription>
        </div>
        <div className="!mt-0">{getData?.icon}</div>
      </CardHeader>
      <CardDescription className="px-6 pb-6">
        <p className="text-base text-muted-foreground">
          {getData?.description || "No description available."}
        </p>
      </CardDescription>
    </Card>
  )
}

export default Cards;
