import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import userServices from '@/services/userService'
import { toast } from 'react-toastify'

export default function ConfirmFormProfile({ isDeleteOpen, deleteToggle }) {
    const handleDelete = async (e) => {
        e.preventDefault();
        const response = await userServices.deleteProfile();
        if (response.status == 200) {
            deleteToggle()
            toast.success('Profile updated successfully')
        }
    }

    return (
        <Dialog open={isDeleteOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Profile</DialogTitle>
                    <DialogDescription>
                        Are you sure want to delete your Profile and all of your data?. Click{' '}
                        <span className="font-bold">Delete</span> button to
                        confirm.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="submit"
                        variant="outline"
                        onClick={deleteToggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={(e)=>handleDelete(e)}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
