import {Button} from "@/components/ui/button"
import {DatePicker} from "@/components/ui/datepicker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useEffect, useState} from "react"
import { toast } from "react-toastify"
import { updateBudget } from "@/redux/features/budgetSlice"
import { useDispatch} from "react-redux"

export default function BudgetForm({ isOpen, toggle, data, currCategory }) {
  const dispatch = useDispatch();
  const [budgetData, setBudgetData] = useState({
    amount: data?.amount || "",
    spent: data?.spent || "",
    startDate: data?.period?.startDate || "",
    endDate: data?.period?.endDate || "",
    category_id: data?.category_id || ""
  })

  useEffect(() => {
    if (data) {
      setBudgetData({
        amount: data?.amount || "",
        spent: data?.spent || "",
        startDate: data?.period?.startDate || "",
        endDate: data?.period?.endDate || "",
        category_id: data?.category_id || "",
      });
    }
  }, [data])
  
  const handleSubmit = async () => {
    dispatch(updateBudget({ id: data?._id, data: budgetData }));
    toggle()
    toast.success("Budget updated successfully")
  }

  const inputData = (key, value) => {
    setBudgetData(state => ({...state, [key]: value}))
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Budget Details</DialogTitle>
          <DialogDescription>
            Make changes to your budget here. Click{" "}
            <span className="font-bold">Save</span> button when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={budgetData?.amount}
              onChange={(e) => {
                inputData("amount", e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="spent" className="text-right">
              Spent
            </Label>
            <Input
              id="spent"
              type="number"
              value={budgetData?.spent}
              onChange={(e) => {
                inputData("spent", e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid w-full grid-cols-4 items-center gap-4">
            <Label htmlFor="" className="text-right">
              Start Date
            </Label>
            <div className="col-span-3">
              <DatePicker
                value={budgetData.startDate}
                setValue={(val) => {
                  inputData("startDate", val);
                }}
              />
            </div>
          </div>
          <div className="grid w-full grid-cols-4 items-center gap-4">
            <Label htmlFor="" className="text-right">
              End Date
            </Label>
            <div className="col-span-3">
              <DatePicker
                value={budgetData.endDate}
                setValue={(val) => {
                  inputData("endDate", val);
                }}
              />
            </div>
          </div>
          <div className="grid w-full grid-cols-4 items-center gap-4">
            <Label htmlFor="" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
              <Select
                value={budgetData?.category_id}
                onValueChange={(val) => {
                  inputData("category_id", val);
                }}
              >
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {currCategory.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" variant="outline" onClick={toggle}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700"
            onClick={handleSubmit}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
