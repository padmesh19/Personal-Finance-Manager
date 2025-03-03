import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import EditTransactionComponent from './EditTransactionComponent'
import { useDispatch, useSelector } from 'react-redux'
import { categoryState } from '@/redux/features/categorySlice'
import { toast } from 'react-toastify'
import { updateTransaction } from '@/redux/features/transactionSlice'

export default function EditTransactionForm({ isOpen, toggle, data }) {
    const dispatch = useDispatch()
    const { categories } = useSelector(categoryState)
    const [currentCategories, setCurrentCategories] = useState([])
    const [errors, setErrors] = useState({}) // State for validation errors

    const [transactionData, setTransactionData] = useState({
        amount: data?.amount || '',
        date: data?.date || '',
        description: data?.description || '',
        transaction_type: data?.transaction_type || '',
        category_id: data?.category_id || '',
    })

    useEffect(() => {
        if (data) {
            setTransactionData({
                amount: data?.amount || '',
                date: data?.date || '',
                description: data?.description || '',
                transaction_type: data?.transaction_type || '',
                category_id: data?.category_id || '',
            })
        }
        if (categories?.length) {
            const filteredCategories = categories.filter(
                (item) => item.category_type === data?.transaction_type
            )
            setCurrentCategories(filteredCategories)
        } else {
            setCurrentCategories([])
        }
    }, [isOpen])

    const handleTabChange = (value) => {
        setTransactionData((state) => ({ ...state, transaction_type: value }))
        if (categories?.length) {
            const filteredCategories = categories?.filter(
                (item) => item.category_type === value
            )
            setCurrentCategories(filteredCategories)
        }
    }

    // Validation function
    const validateInputs = () => {
        const newErrors = {}
        if (!transactionData.amount || transactionData.amount <= 0) {
            newErrors.amount =
                'Amount is required and must be greater than zero.'
        }
        if (!transactionData.date) {
            newErrors.date = 'Date is required.'
        }
        if (
            !transactionData.description ||
            transactionData.description.length < 3
        ) {
            newErrors.description =
                'Description is required and must be at least 3 characters.'
        }
        if (!transactionData.category_id) {
            newErrors.category_id = 'Please select a category.'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (validateInputs()) {
            dispatch(
                updateTransaction({ id: data?._id, data: transactionData })
            )
            toggle()
            toast.success('Transaction updated successfully')
            setTransactionData({
                amount: '',
                date: '',
                description: '',
                transaction_type: '',
                category_id: '',
            })
        } else {
            toast.error('Please fix the errors before submitting.')
        }
    }

    const inputData = (key, value) => {
        setTransactionData((state) => ({ ...state, [key]: value }))
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent className="rounded-lg border border-slate-100 bg-slate-50 sm:max-w-[2/8] [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                    <DialogDescription>
                        Edit your transaction here. Click{' '}
                        <span className="font-bold">Update</span> when you're
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Tabs
                        value={transactionData.transaction_type}
                        className="w-full"
                        onValueChange={handleTabChange}
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-slate-200">
                            <TabsTrigger value="income">Income</TabsTrigger>
                            <TabsTrigger value="expense">Expense</TabsTrigger>
                        </TabsList>
                        <TabsContent value="expense">
                            <EditTransactionComponent
                                inputData={inputData}
                                categories={currentCategories}
                                data={transactionData}
                                errors={errors}
                            />
                        </TabsContent>
                        <TabsContent value="income">
                            <EditTransactionComponent
                                inputData={inputData}
                                categories={currentCategories}
                                data={transactionData}
                                errors={errors}
                            />
                        </TabsContent>
                    </Tabs>
                    <DialogFooter className="gap-2">
                        <Button
                            type="submit"
                            variant="outline"
                            onClick={toggle}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={handleSubmit}
                        >
                            Update Transaction
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
