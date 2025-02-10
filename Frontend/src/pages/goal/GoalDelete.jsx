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
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { deleteGoal } from "@/redux/features/goalSlice";

export default function GoalDelete({ isDeleteOpen, deleteToggle, data }) {
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    dispatch(deleteGoal(data?._id))
    deleteToggle();
    toast.success("Goal deleted successfully");
  };

  return (
    <Dialog open={isDeleteOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete goal</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this goal?. Click{" "}
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
