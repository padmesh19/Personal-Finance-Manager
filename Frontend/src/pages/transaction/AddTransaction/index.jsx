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

    const [transactionData, setTransactionData] = useState({
        amount: '',
        date: new Date(),
        description: '',
        transaction_type: 'income',
        category_id: '',
    })

    useEffect(() => {
        const currentCategories = categories.filter(
            (item) => item.category_type === transactionData.transaction_type
        )
        setCurrentCategories(currentCategories)
    }, [isAddOpen])

    const handleTabChange = (value) => {
        setTransactionData((state) => ({ ...state, transaction_type: value }))
        if (categories?.length) {
            const currentCategories = categories?.filter(
                (item) => item.category_type === value
            )
            setCurrentCategories(currentCategories)
        }
    }

    const handleSubmit = async () => {
        if (transactionData.transaction_type === 'expense') {
            const budget = budgets.find(
                (b) =>
                    b.category_id === transactionData.category_id &&
                    new Date(b.period.startDate) <= new Date(transactionData.date) &&
                    new Date(b.period.endDate) >= new Date(transactionData.date)
            )

            if (budget) {
                const newSpent = budget.spent + parseFloat(transactionData.amount)

                if (newSpent > budget.amount) {
                    return toast.error(
                        'Budget limit exceeded for this category!'
                    )
                }
            }
        }

        // Dispatch transaction if within budget
        const response = await dispatch(addTransaction(transactionData))

        if (response.meta.requestStatus === 'fulfilled') {
            toast.success('Transaction added successfully!')
            addToggle()
            setTransactionData({
                amount: '',
                date: '',
                description: '',
                transaction_type: '',
                category_id: '',
            })
        } else {
            toast.error('Failed to add transaction!')
        }
    }

    const inputData = (key, value) => {
        setTransactionData((state) => ({ ...state, [key]: value }))
    }
    return (
        <>
            <Dialog open={isAddOpen}>
                <DialogContent className="rounded-lg border border-slate-100 bg-slate-50 sm:max-w-[2/8] [&>button]:hidden">
                    <DialogHeader>
                        <DialogTitle>Add a New Transaction</DialogTitle>
                        <DialogDescription>
                            Add your new transaction here. Click{' '}
                            <span className="font-bold">Add</span> when you're
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Tabs
                            defaultValue="income"
                            className="w-full"
                            onValueChange={handleTabChange}
                        >
                            <TabsList className="grid w-full grid-cols-2 bg-slate-200">
                                <TabsTrigger value="income">Income</TabsTrigger>
                                <TabsTrigger value="expense">
                                    Expense
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="expense">
                                <div className="">
                                    <TransactionForm
                                        inputData={inputData}
                                        categories={currentCategories}
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent value="income">
                                <div className="">
                                    <TransactionForm
                                        inputData={inputData}
                                        categories={currentCategories}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter className="gap-2">
                            <Button
                                type="submit"
                                variant="outline"
                                onClick={addToggle}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700"
                                onClick={handleSubmit}
                            >
                                Add Transaction
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddTransaction
