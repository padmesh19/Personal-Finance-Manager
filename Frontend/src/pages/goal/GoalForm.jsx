import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/datepicker'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateGoal } from '@/redux/features/goalSlice'

export default function GoalForm({ isOpen, toggle, data }) {
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({})

    const [goalData, setGoalData] = useState({
        name: data?.name || '',
        targetAmount: data?.targetAmount || '',
        currentAmount: data?.currentAmount || '',
        deadline: data?.deadline || '',
        status: data?.status || '',
    })

    useEffect(() => {
        if (data) {
            setGoalData({
                name: data?.name || '',
                targetAmount: data?.targetAmount || '',
                currentAmount: data?.currentAmount || '',
                deadline: data?.deadline || '',
                status: data?.status || '',
            })
        }
    }, [data])

    const validateInputs = () => {
        let newErrors = {}
        let valid = true

        if (!goalData.name || goalData.name.length < 3) {
            newErrors.name = 'Goal name must be at least 3 characters long.'
            valid = false
        }

        if (!goalData.targetAmount || goalData.targetAmount <= 0) {
            newErrors.targetAmount = 'Target amount must be a positive number.'
            valid = false
        }

        if (!goalData.currentAmount || goalData.currentAmount < 0) {
            newErrors.currentAmount = 'Current amount cannot be negative.'
            valid = false
        } else if (
            parseFloat(goalData.currentAmount) >
            parseFloat(goalData.targetAmount)
        ) {
            newErrors.currentAmount =
                'Current amount cannot exceed target amount.'
            valid = false
        }

        if (!goalData.deadline) {
            newErrors.deadline = 'Deadline is required.'
            valid = false
        }

        if (!goalData.status) {
            newErrors.status = 'Please select a status.'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = async () => {
        if (!validateInputs()) return

        dispatch(updateGoal({ id: data?._id, data: goalData }))
        toggle()
        toast.success('Goal updated successfully')
    }

    const inputData = (key, value) => {
        setGoalData((state) => ({ ...state, [key]: value }))
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Goal Details</DialogTitle>
                    <DialogDescription>
                        Make changes to your goal here. Click{' '}
                        <span className="font-bold">Save</span> when you're
                        done.
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
                            value={goalData?.name}
                            onChange={(e) => inputData('name', e.target.value)}
                            className="col-span-3"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm col-span-4">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="targetAmount" className="text-right">
                            Target Amount
                        </Label>
                        <Input
                            id="targetAmount"
                            type="number"
                            value={goalData?.targetAmount}
                            onChange={(e) =>
                                inputData('targetAmount', e.target.value)
                            }
                            className="col-span-3"
                        />
                        {errors.targetAmount && (
                            <span className="text-red-500 text-sm col-span-4">
                                {errors.targetAmount}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currentAmount" className="text-right">
                            Current Amount
                        </Label>
                        <Input
                            id="currentAmount"
                            type="number"
                            value={goalData?.currentAmount}
                            onChange={(e) =>
                                inputData('currentAmount', e.target.value)
                            }
                            className="col-span-3"
                        />
                        {errors.currentAmount && (
                            <span className="text-red-500 text-sm col-span-4">
                                {errors.currentAmount}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">
                            Deadline
                        </Label>
                        <div className="col-span-3">
                            <DatePicker
                                value={goalData.deadline}
                                setValue={(val) => inputData('deadline', val)}
                            />
                        </div>
                        {errors.deadline && (
                            <span className="text-red-500 text-sm col-span-4">
                                {errors.deadline}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <RadioGroup
                            value={goalData?.status}
                            className="flex gap-8 col-span-3"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    id="option-one"
                                    value="in-progress"
                                    onClick={() =>
                                        inputData('status', 'in-progress')
                                    }
                                />
                                <Label htmlFor="option-one">In-Progress</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    id="option-two"
                                    value="completed"
                                    onClick={() =>
                                        inputData('status', 'completed')
                                    }
                                />
                                <Label htmlFor="option-two">Completed</Label>
                            </div>
                        </RadioGroup>
                        {errors.status && (
                            <span className="text-red-500 text-sm col-span-4">
                                {errors.status}
                            </span>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={toggle}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={handleSubmit}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
