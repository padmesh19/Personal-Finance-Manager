import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TransactionForm } from './TransactionForm'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { categoryState } from '@/redux/features/categorySlice'
import { addTransaction } from '@/redux/features/transactionSlice'

const AddTransaction = ({ isAddOpen, addToggle }) => {
    const dispatch = useDispatch()
    const { categories } = useSelector(categoryState)
    const { budgets } = useSelector((state) => state.budget)
    const [currentCategories, setCurrentCategories] = useState([])
    const [errors, setErrors] = useState({}) // State for validation errors

    const [transactionData, setTransactionData] = useState({
        amount: '',
        date: new Date(),
        description: '',
        transaction_type: 'income',
        category_id: '',
    })

    useEffect(() => {
        const filteredCategories = categories.filter(
            (item) => item.category_type === transactionData.transaction_type
        )
        setCurrentCategories(filteredCategories)
    }, [isAddOpen, transactionData.transaction_type, categories])

    const handleTabChange = (value) => {
        setTransactionData((state) => ({ ...state, transaction_type: value }))
        const filteredCategories = categories.filter(
            (item) => item.category_type === value
        )
        setCurrentCategories(filteredCategories)
    }

    const validateFields = () => {
        let newErrors = {}
        if (!transactionData.amount || transactionData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0.'
        }
        if (!transactionData.date) {
            newErrors.date = 'Date is required.'
        }
        if (!transactionData.description.trim()) {
            newErrors.description = 'Description cannot be empty.'
        }
        if (!transactionData.category_id) {
            newErrors.category_id = 'Please select a category.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 // Returns true if no errors
    }

    const handleSubmit = async () => {
        if (!validateFields()) {
            return toast.error('Please correct the errors before submitting.')
        }

        if (transactionData.transaction_type === 'expense') {
            const budget = budgets.find(
                (b) =>
                    b.category_id === transactionData.category_id &&
                    new Date(b.period.startDate) <=
                        new Date(transactionData.date) &&
                    new Date(b.period.endDate) >= new Date(transactionData.date)
            )

            if (budget) {
                const newSpent =
                    budget.spent + parseFloat(transactionData.amount)
                if (newSpent > budget.amount) {
                    return toast.error(
                        'Budget limit exceeded for this category!'
                    )
                }
            }
        }

        const response = await dispatch(addTransaction(transactionData))

        if (response.meta.requestStatus === 'fulfilled') {
            toast.success('Transaction added successfully!')
            addToggle()
            setTransactionData({
                amount: '',
                date: new Date(),
                description: '',
                transaction_type: 'income',
                category_id: '',
            })
            setErrors({})
        } else {
            toast.error('Failed to add transaction!')
        }
    }

    const inputData = (key, value) => {
        setTransactionData((state) => ({ ...state, [key]: value }))
        setErrors((prev) => ({ ...prev, [key]: '' })) // Clear error when input is corrected
    }

    return (
        <Dialog open={isAddOpen}>
            <DialogContent className="rounded-lg border bg-slate-50 sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add a New Transaction</DialogTitle>
                    <DialogDescription>
                        Fill in the details below and click <b>Add</b> to save.
                    </DialogDescription>
                </DialogHeader>
                <Tabs
                    defaultValue="income"
                    className="w-full"
                    onValueChange={handleTabChange}
                >
                    <TabsList className="grid w-full grid-cols-2 bg-slate-200">
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="expense">Expense</TabsTrigger>
                    </TabsList>
                    <TabsContent value="expense">
                        <TransactionForm
                            inputData={inputData}
                            categories={currentCategories}
                            errors={errors}
                        />
                    </TabsContent>
                    <TabsContent value="income">
                        <TransactionForm
                            inputData={inputData}
                            categories={currentCategories}
                            errors={errors}
                        />
                    </TabsContent>
                </Tabs>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={addToggle}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={handleSubmit}
                    >
                        Add Transaction
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddTransaction
