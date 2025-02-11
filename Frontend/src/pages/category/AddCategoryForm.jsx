import { Button } from '@/components/ui/button'
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
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { addCategory } from '@/redux/features/categorySlice'

export default function AddCategoryForm({ isAddOpen, addToggle }) {
    const dispatch = useDispatch()
    const [categoryData, setCategoryData] = useState({
        name: '',
        category_type: '',
    })
    const [errors, setErrors] = useState({ name: '', category_type: '' })

    const validateInputs = () => {
        let valid = true
        let newErrors = { name: '', category_type: '' }

        if (!categoryData.name.trim()) {
            newErrors.name = 'Category name is required.'
            valid = false
        } else if (categoryData.name.trim().length < 3) {
            newErrors.name = 'Category name must be at least 3 characters.'
            valid = false
        }

        if (!categoryData.category_type) {
            newErrors.category_type = 'Please select a category type.'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = async () => {
        if (!validateInputs()) return

        dispatch(addCategory(categoryData))
        addToggle()
        toast.success('Category added successfully')
        setCategoryData({ name: '', category_type: '' })
    }

    const inputData = (key, value) => {
        setCategoryData((state) => ({ ...state, [key]: value }))
    }

    return (
        <Dialog open={isAddOpen}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Category Details</DialogTitle>
                    <DialogDescription>
                        Add your category here. Click{' '}
                        <span className="font-bold">Save</span> when you're
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Category Name Input */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Category Name
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="name"
                                type="text"
                                value={categoryData?.name}
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

                    {/* Category Type Selection */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Category Type</Label>
                        <div className="col-span-3 flex gap-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    id="income"
                                    name="category_type"
                                    type="radio"
                                    checked={
                                        categoryData.category_type === 'income'
                                    }
                                    onChange={() =>
                                        inputData('category_type', 'income')
                                    }
                                    className="w-4"
                                />
                                <Label htmlFor="income">Income</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="expense"
                                    name="category_type"
                                    type="radio"
                                    checked={
                                        categoryData.category_type === 'expense'
                                    }
                                    onChange={() =>
                                        inputData('category_type', 'expense')
                                    }
                                    className="w-4"
                                />
                                <Label htmlFor="expense">Expense</Label>
                            </div>
                        </div>
                    </div>
                    {errors.category_type && (
                        <span className="text-red-500 text-sm text-center">
                            {errors.category_type}
                        </span>
                    )}
                </div>

                {/* Buttons */}
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={addToggle}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
