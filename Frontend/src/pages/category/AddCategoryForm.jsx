import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addCategory } from "@/redux/features/categorySlice";

export default function AddCategoryForm({ isAddOpen, addToggle }) {
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState({
    name: "",
    category_type:""
  });

  const handleSubmit = async () => {
    if (categoryData.name && categoryData.category_type) {
      dispatch(addCategory(categoryData))
      addToggle();
      toast.success("Category added successfully");
      setCategoryData({
        name: "",
        category_type: "",
      });
    } else {
      toast.error('Fill all the details');
    }
    
  };

  const inputData = (key, value) => {
    setCategoryData((state) => ({ ...state, [key]: value }));
  };

  return (
    <Dialog open={isAddOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Category Details</DialogTitle>
          <DialogDescription>
            Add your category here. Click{" "}
            <span className="font-bold">Save</span> button when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Category Name
            </Label>
            <Input
              id="name"
              type="text"
              value={categoryData?.name}
              onChange={(e) => {
                inputData("name", e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="" className="text-right">
              Category Type
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="income"
                name="category_type"
                type="radio"
                onClick={() => {
                  inputData("category_type", "income");
                }}
                className="col-span-2 w-4"
              />
              <Label htmlFor="income">Income</Label>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="expense"
                name="category_type"
                type="radio"
                onClick={() => {
                  inputData("category_type", "expense");
                }}
                className="col-span-2 w-4"
              />
              <Label htmlFor="expense">Expense</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" variant="outline" onClick={addToggle}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
