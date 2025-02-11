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
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { addGoal } from '@/redux/features/goalSlice'

export default function AddGoalForm({ isAddOpen, addToggle }) {
    const dispatch = useDispatch()
    const [goalData, setGoalData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        status: '',
    })

    const [errors, setErrors] = useState({})

    const validateInputs = () => {
        let newErrors = {}
        let valid = true

        if (!goalData.name.trim()) {
            newErrors.name = 'Goal name is required.'
            valid = false
        } else if (goalData.name.length < 3) {
            newErrors.name = 'Goal name must be at least 3 characters.'
            valid = false
        }

        if (!goalData.targetAmount) {
            newErrors.targetAmount = 'Target amount is required.'
            valid = false
        } else if (
            isNaN(goalData.targetAmount) ||
            Number(goalData.targetAmount) <= 0
        ) {
            newErrors.targetAmount = 'Target amount must be a positive number.'
            valid = false
        }

        if (!goalData.currentAmount) {
            newErrors.currentAmount = 'Current amount is required.'
            valid = false
        } else if (
            isNaN(goalData.currentAmount) ||
            Number(goalData.currentAmount) < 0
        ) {
            newErrors.currentAmount = 'Current amount cannot be negative.'
            valid = false
        } else if (
            Number(goalData.currentAmount) > Number(goalData.targetAmount)
        ) {
            newErrors.currentAmount =
                'Current amount cannot exceed target amount.'
            valid = false
        }

        if (!goalData.deadline) {
            newErrors.deadline = 'Deadline is required.'
            valid = false
        } else {
            const selectedDate = new Date(goalData.deadline)
            const today = new Date()
            if (selectedDate <= today) {
                newErrors.deadline = 'Deadline must be a future date.'
                valid = false
            }
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

        dispatch(addGoal(goalData))
        addToggle()
        toast.success('Goal added successfully')

        setGoalData({
            name: '',
            targetAmount: '',
            currentAmount: '',
            deadline: '',
            status: '',
        })
    }

    const inputData = (key, value) => {
        setGoalData((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <Dialog open={isAddOpen}>
            <DialogContent className="md:max-w-[600px] sm:max-w-[425px] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Add a New Goal</DialogTitle>
                    <DialogDescription>
                        Add your goal here. Click{' '}
                        <span className="font-bold">Add</span> when you're done.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Goal Name
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="name"
                                type="text"
                                value={goalData.name}
                                onChange={(e) =>
                                    inputData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <span className="text-red-500 text-sm">
                                    {errors.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="targetAmount" className="text-right">
                            Target Amount
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="targetAmount"
                                type="number"
                                value={goalData.targetAmount}
                                onChange={(e) =>
                                    inputData('targetAmount', e.target.value)
                                }
                            />
                            {errors.targetAmount && (
                                <span className="text-red-500 text-sm">
                                    {errors.targetAmount}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currentAmount" className="text-right">
                            Current Amount
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="currentAmount"
                                type="number"
                                value={goalData.currentAmount}
                                onChange={(e) =>
                                    inputData('currentAmount', e.target.value)
                                }
                            />
                            {errors.currentAmount && (
                                <span className="text-red-500 text-sm">
                                    {errors.currentAmount}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Deadline</Label>
                        <div className="col-span-3">
                            <DatePicker
                                setValue={(val) => inputData('deadline', val)}
                            />
                            {errors.deadline && (
                                <span className="text-red-500 text-sm">
                                    {errors.deadline}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Status</Label>
                        <RadioGroup className="flex items-center justify-start gap-8 col-span-3">
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
                            <span className="text-red-500 text-sm col-span-3 ml-28">
                                {errors.status}
                            </span>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={addToggle}>
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
    )
}
