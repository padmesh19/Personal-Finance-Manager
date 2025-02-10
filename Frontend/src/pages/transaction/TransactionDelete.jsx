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
import { deleteTransaction } from "@/redux/features/transactionSlice";

export default function TransactionDelete({ isDeleteOpen, deleteToggle, data }) {
  const dispatch = useDispatch()
  const handleSubmit = async () => {
    if (dispatch(deleteTransaction(data?._id))) {
      deleteToggle();
      toast.success("Transaction deleted successfully");
    }
  };

  return (
    <Dialog open={isDeleteOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete transaction</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this transaction?. Click{" "}
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
