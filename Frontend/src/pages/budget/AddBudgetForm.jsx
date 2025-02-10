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
import {useState} from "react"
import { toast } from "react-toastify"
import { addBudget } from "@/redux/features/budgetSlice";
import { useDispatch } from "react-redux"

export default function AddBudgetForm({ isAddOpen, addToggle, currCategory}) {
  const dispatch = useDispatch();
  const [budgetData, setBudgetData] = useState({
    amount: "",
    spent: "",
    startDate: new Date(),
    endDate: "",
    category_id: "",
  })

  const handleSubmit = async () => {
      dispatch(addBudget(budgetData))
      addToggle()
      toast.success("Budget added successfully")
      setBudgetData({
        amount: "",
        spent: "",
        startDate: new Date(),
        endDate: "",
        category_id: "",
      })
  }

  const inputData = (key, value) => {
    setBudgetData(state => ({...state, [key]: value}))
  }

  return (
    <Dialog open={isAddOpen}>
      <DialogContent className="md:max-w-[600px] sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add a New Budget</DialogTitle>
          <DialogDescription>
            Add your budget here. Click <span className="font-bold">Add</span>{" "}
            when you're done.
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
              onChange={e => {
                inputData("amount", e.target.value)
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
              onChange={e => {
                inputData("spent", e.target.value)
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
                setValue={val => {
                  inputData("startDate", val)
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
                setValue={val => {
                  inputData("endDate", val)
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
                onValueChange={e => {
                  inputData("category_id", e)
                }}
              >
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {currCategory.map(category => (
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
          <Button type="submit" variant="outline" onClick={addToggle}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700"
            onClick={handleSubmit}
          >
            Add Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
