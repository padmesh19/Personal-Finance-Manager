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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateCategory } from '@/redux/features/categorySlice'

export default function CategoryForm({ isOpen, toggle, data }) {
    const dispatch = useDispatch()
    const [categoryData, setCategoryData] = useState({
        name: data?.name || '',
        category_type: data?.category_type || '',
    })

    const [errors, setErrors] = useState({ name: '', category_type: '' })

    useEffect(() => {
        if (data) {
            setCategoryData({
                name: data?.name || '',
                category_type: data?.category_type || '',
            })
        }
    }, [data])

    const validateInputs = () => {
        let valid = true
        let newErrors = { name: '', category_type: '' }

        if (!categoryData.name.trim()) {
            newErrors.name = 'Category name is required.'
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

        dispatch(updateCategory({ id: data?._id, data: categoryData }))
        toggle()
        toast.success('Category updated successfully')
    }

    const inputData = (key, value) => {
        setCategoryData((state) => ({ ...state, [key]: value }))
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Category Details</DialogTitle>
                    <DialogDescription>
                        Edit your category here. Click{' '}
                        <span className="font-bold">Save</span> when you're
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Category Type</Label>
                        <div className="col-span-3">
                            <RadioGroup
                                value={categoryData?.category_type}
                                className="flex items-center gap-8"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        id="income"
                                        value="income"
                                        onClick={() =>
                                            inputData('category_type', 'income')
                                        }
                                    />
                                    <Label htmlFor="income">Income</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        id="expense"
                                        value="expense"
                                        onClick={() =>
                                            inputData(
                                                'category_type',
                                                'expense'
                                            )
                                        }
                                    />
                                    <Label htmlFor="expense">Expense</Label>
                                </div>
                            </RadioGroup>
                            {errors.category_type && (
                                <span className="text-red-500 text-sm">
                                    {errors.category_type}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={toggle}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
