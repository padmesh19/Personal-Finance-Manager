import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateCategory } from "@/redux/features/categorySlice";

export default function CategoryForm({ isOpen, toggle, data }) {
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState({
    name: data?.name || "",
    category_type: data?.category_type || "",
  });

  useEffect(() => {
    if (data) {
      setCategoryData({
        name: data?.name || "",
        category_type: data?.category_type || "",
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    dispatch(updateCategory({ id: data?._id, data: categoryData }));
    toggle();
    toast.success("Category updated successfully");
  };

  const inputData = (key, value) => {
    setCategoryData((state) => ({ ...state, [key]: value }));
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Category Details</DialogTitle>
          <DialogDescription>
            Edit your category here. Click{" "}
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
            <RadioGroup
              value={categoryData?.category_type}
              className="flex items-center justify-start gap-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="option-one"
                  value="income"
                  onClick={() => {
                    inputData("category_type", "income");
                  }}
                />
                <Label htmlFor="option-one">Income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="option-two"
                  value="expense"
                  onClick={() => {
                    inputData("category_type", "expense");
                  }}
                />
                <Label htmlFor="option-two">Expense</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" variant="outline" onClick={toggle}>
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
