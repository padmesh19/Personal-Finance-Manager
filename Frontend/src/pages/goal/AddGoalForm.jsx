import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {  useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addGoal } from "@/redux/features/goalSlice";

export default function AddGoalForm({ isAddOpen, addToggle }) {
  const dispatch = useDispatch();
  const [goalData, setGoalData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    status: "",
  });

  const handleSubmit = async () => {
    if (
      goalData.name &&
      goalData.targetAmount &&
      goalData.currentAmount &&
      goalData.deadline &&
      goalData.status
    ) {
      dispatch(addGoal(goalData));
      addToggle();
      toast.success("Budget added successfully");
      setGoalData({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        status: "",
      });
    } else {
      toast.error("Fill all the details");
    }
  };

  const inputData = (key, value) => {
    setGoalData((state) => ({ ...state, [key]: value }));
  };

  return (
    <Dialog open={isAddOpen}>
      <DialogContent className="md:max-w-[600px] sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add a New Goal</DialogTitle>
          <DialogDescription>
            Add your goal here. Click <span className="font-bold">Add</span>{" "}
            when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Goal Name
            </Label>
            <Input
              id="name"
              type="text"
              onChange={(e) => {
                inputData("name", e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetAmount" className="text-right">
              Target Amount
            </Label>
            <Input
              id="targetAmount"
              type="number"
              onChange={(e) => {
                inputData("targetAmount", e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid w-full grid-cols-4 items-center gap-4">
            <Label htmlFor="currentAmount" className="text-right">
              Current Amount
            </Label>
            <Input
              id="currentAmount"
              type="number"
              onChange={(e) => {
                inputData("currentAmount", e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid w-full grid-cols-4 items-center gap-4">
            <Label htmlFor="" className="text-right">
              Deadline
            </Label>
            <div className="col-span-3">
              <DatePicker
                setValue={(val) => {
                  inputData("deadline", val);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="" className="text-right">
              Status
            </Label>
            <RadioGroup
              className="flex items-center justify-start gap-8 col-span-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="option-one"
                  value="in-progress"
                  onClick={() => {
                    inputData("status", "in-progress");
                  }}
                />
                <Label htmlFor="option-one">In-Progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="option-two"
                  value="completed"
                  onClick={() => {
                    inputData("status", "completed");
                  }}
                />
                <Label htmlFor="option-two">Completed</Label>
              </div>
            </RadioGroup>
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
            Add Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
