import {Button} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteBudget } from "@/redux/features/budgetSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";


export default function BudgetDelete({ isDeleteOpen, deleteToggle, data}) {
  const dispatch = useDispatch();
  const handleDelete = async () => {
    dispatch(deleteBudget(data?._id));
    deleteToggle();
    toast.success("Budget deleted successfully");
  };

  return (
    <Dialog open={isDeleteOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete budget</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this budget?. Click{" "}
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
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
