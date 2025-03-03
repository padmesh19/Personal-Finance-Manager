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
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { updateBudget } from '@/redux/features/budgetSlice'
import { useDispatch } from 'react-redux'

export default function BudgetForm({ isOpen, toggle, data, currCategory }) {
    const dispatch = useDispatch()
    const [budgetData, setBudgetData] = useState({
        amount: data?.amount || '',
        startDate: data?.period?.startDate || '',
        endDate: data?.period?.endDate || '',
        category_id: data?.category_id || '',
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (data) {
            setBudgetData({
                amount: data?.amount || '',
                startDate: data?.period?.startDate || '',
                endDate: data?.period?.endDate || '',
                category_id: data?.category_id || '',
            })
        }
    }, [data])

    const validateInputs = () => {
        let valid = true
        let newErrors = {}

        if (
            !budgetData.amount ||
            isNaN(budgetData.amount) ||
            budgetData.amount <= 0
        ) {
            newErrors.amount = 'Amount must be a positive number.'
            valid = false
        }

        if (!budgetData.startDate) {
            newErrors.startDate = 'Start date is required.'
            valid = false
        }

        if (!budgetData.endDate) {
            newErrors.endDate = 'End date is required.'
            valid = false
        } else if (
            new Date(budgetData.endDate) <= new Date(budgetData.startDate)
        ) {
            newErrors.endDate = 'End date must be after start date.'
            valid = false
        }

        if (!budgetData.category_id) {
            newErrors.category_id = 'Category selection is required.'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = async () => {
        if (!validateInputs()) return

        dispatch(updateBudget({ id: data?._id, data: budgetData }))
        toggle()
        toast.success('Budget updated successfully')
    }

    const inputData = (key, value) => {
        setBudgetData((state) => ({ ...state, [key]: value }))
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] md:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Budget Details</DialogTitle>
                    <DialogDescription>
                        Make changes to your budget here. Click{' '}
                        <span className="font-bold">Save</span> when you're
                        done.
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
                                value={budgetData?.amount}
                                onChange={(e) =>
                                    inputData('amount', e.target.value)
                                }
                            />
                            {errors.amount && (
                                <span className="text-red-500 text-sm">
                                    {errors.amount}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-4 items-center gap-4">
                        <Label className="text-right">Start Date</Label>
                        <div className="col-span-3">
                            <DatePicker
                                value={budgetData.startDate}
                                setValue={(val) => inputData('startDate', val)}
                            />
                            {errors.startDate && (
                                <span className="text-red-500 text-sm">
                                    {errors.startDate}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-4 items-center gap-4">
                        <Label className="text-right">End Date</Label>
                        <div className="col-span-3">
                            <DatePicker
                                value={budgetData.endDate}
                                setValue={(val) => inputData('endDate', val)}
                            />
                            {errors.endDate && (
                                <span className="text-red-500 text-sm">
                                    {errors.endDate}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-4 items-center gap-4">
                        <Label className="text-right">Category</Label>
                        <div className="col-span-3">
                            <Select
                                value={budgetData?.category_id}
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
                                <span className="text-red-500 text-sm">
                                    {errors.category_id}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={toggle}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
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
