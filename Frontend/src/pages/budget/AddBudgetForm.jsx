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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { addBudget } from '@/redux/features/budgetSlice'
import { useDispatch } from 'react-redux'

export default function AddBudgetForm({ isAddOpen, addToggle, currCategory }) {
    const dispatch = useDispatch()
    const [budgetData, setBudgetData] = useState({
        amount: '',
        startDate: new Date(),
        endDate: '',
        category_id: '',
    })

    const [errors, setErrors] = useState({})

    const validateInputs = () => {
        let valid = true
        let newErrors = {}

        // Amount validation
        if (!budgetData.amount) {
            newErrors.amount = 'Amount is required.'
            valid = false
        } else if (isNaN(budgetData.amount) || Number(budgetData.amount) <= 0) {
            newErrors.amount = 'Amount must be a positive number.'
            valid = false
        }

        // Start date validation
        if (!budgetData.startDate) {
            newErrors.startDate = 'Start date is required.'
            valid = false
        }

        // End date validation (if provided, it must be after start date)
        if (
            budgetData.endDate &&
            new Date(budgetData.endDate) <= new Date(budgetData.startDate)
        ) {
            newErrors.endDate = 'End date must be after the start date.'
            valid = false
        }

        // Category validation
        if (!budgetData.category_id) {
            newErrors.category_id = 'Category is required.'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = async () => {
        if (!validateInputs()) return

        try {
            await dispatch(addBudget(budgetData)).unwrap()

            toast.success('Budget added successfully!')
            addToggle()

            setBudgetData({
                amount: '',
                startDate: new Date(),
                endDate: '',
                category_id: '',
            })
            setErrors({})
        } catch (error) {
            toast.error('Budget already exists for this category!')
        }
    }

    const inputData = (key, value) => {
        setBudgetData((state) => ({ ...state, [key]: value }))
    }

    return (
        <Dialog open={isAddOpen}>
            <DialogContent className="md:max-w-[600px] sm:max-w-[425px] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Add a New Budget</DialogTitle>
                    <DialogDescription>
                        Add your budget here. Click{' '}
                        <span className="font-bold">Add</span> when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="amount"
                                type="number"
                                value={budgetData.amount}
                                onChange={(e) =>
                                    inputData('amount', e.target.value)
                                }
                            />
                            {errors.amount && (
                                <p className="text-red-500 text-sm">
                                    {errors.amount}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-4 items-center gap-4">
                        <Label className="text-right">Start Date</Label>
                        <div className="col-span-3">
                            <DatePicker
                                setValue={(val) => inputData('startDate', val)}
                            />
                            {errors.startDate && (
                                <p className="text-red-500 text-sm">
                                    {errors.startDate}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-4 items-center gap-4">
                        <Label className="text-right">End Date</Label>
                        <div className="col-span-3">
                            <DatePicker
                                setValue={(val) => inputData('endDate', val)}
                            />
                            {errors.endDate && (
                                <p className="text-red-500 text-sm">
                                    {errors.endDate}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-4 items-center gap-4">
                        <Label className="text-right">Category</Label>
                        <div className="col-span-3">
                            <Select
                                onValueChange={(val) =>
                                    inputData('category_id', val)
                                }
                            >
                                <SelectTrigger className="h-9 bg-white">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currCategory.map((category) => (
                                        <SelectItem
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && (
                                <p className="text-red-500 text-sm">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={addToggle}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={handleSubmit}
                    >
                        Add Budget
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
