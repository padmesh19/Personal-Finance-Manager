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
import { deleteCategory } from "@/redux/features/categorySlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function CategoryDelete({ isDeleteOpen, deleteToggle, data }) {
   const dispatch = useDispatch();
  const handleSubmit = async () => {
    dispatch(deleteCategory(data?._id));
    deleteToggle();
    toast.success("Category deleted successfully");
  };

  return (
    <Dialog open={isDeleteOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this category?. Click{" "}
            <span className="font-bold">Delete</span> button to confirm.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" variant="outline" onClick={deleteToggle}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleSubmit}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
