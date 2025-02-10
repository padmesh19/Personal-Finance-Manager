import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Pencil, Trash2, Plus, X, FileDownIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

import AddTransaction from './AddTransaction'
import EditTransactionForm from './EditTransaction/index'
import TransactionDelete from './TransactionDelete'
import { useDispatch, useSelector } from 'react-redux'
import { categoryState } from '@/redux/features/categorySlice'
import { Filters } from './Filters'
import {
    fetchTransaction,
    exportTransactions,
} from '@/redux/features/transactionSlice'
import { Badge } from '@/components/ui/badge'

const FiltersChip = ({ transactionFilters, clearFilter }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {Object.keys(transactionFilters).map((key) => {
                if (transactionFilters[key]) {
                    let displayValue = transactionFilters[key]
                    let displayName = key
                    switch (key) {
                        case 'start_date':
                            displayValue = format(
                                new Date(transactionFilters[key]),
                                'PPP'
                            )
                            displayName = 'Start Date'
                            break
                        case 'end_date':
                            displayValue = format(
                                new Date(transactionFilters[key]),
                                'PPP'
                            )
                            displayName = 'End Date'
                            break
                        case 'category_id':
                            displayName = 'Category'
                            break
                        case 'transaction_type':
                            displayName = 'Transaction Type'
                            break
                        default:
                            break
                    }
                    return (
                        <Badge
                            key={key}
                            variant="outline"
                            className="bg-slate-200"
                        >
                            {displayName} : {displayValue}
                            <X
                                className="ml-2 cursor-pointer"
                                size={16}
                                onClick={() => clearFilter(key)}
                            />
                        </Badge>
                    )
                }
                return null
            })}
        </div>
    )
}

export default function TransactionList() {
    const { categories } = useSelector(categoryState)
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()
    const { transactions, isExport } = useSelector((state) => state.transaction)
    const [isOpen, setIsOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [data, setData] = useState(null)
    const [transactionFilters, setTransactionFilters] = useState({
        start_date: data?.start_date || '',
        end_date: data?.end_date || '',
        transaction_type: data?.transaction_type || '',
        category_id: data?.category_id || '',
    })

    useEffect(() => {
        getFilterFromQueryParams()
    }, [dispatch])

    const toggle = () => {
        setIsOpen(!isOpen)
        setData(null)
    }
    const deleteToggle = () => {
        setIsDeleteOpen(!isDeleteOpen)
        setData(null)
    }
    const addToggle = () => {
        setIsAddOpen(!isAddOpen)
        setData('')
    }
    const filterChanges = () => {
        setQueryParams(transactionFilters)
        dispatch(fetchTransaction(transactionFilters))
    }

    const setFilterData = (key, value) => {
        setTransactionFilters((state) => ({ ...state, [key]: value }))
    }

    const setQueryParams = (filters) => {
        const params = new URLSearchParams()
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                params.set(key, filters[key])
            }
        })
        setSearchParams(params)
    }

    function getFilterFromQueryParams() {
        const filters = {}
        searchParams.forEach((data, name) => {
            setFilterData(name, data)
            filters[name] = data
        })
        dispatch(fetchTransaction(filters))
    }
    function clearFilter(key) {
        setTransactionFilters((state) => ({ ...state, [key]: '' }))
        const filters = { ...transactionFilters, [key]: '' }
        const params = new URLSearchParams()
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                params.set(key, filters[key])
            }
        })
        setSearchParams(params)
        dispatch(fetchTransaction(filters))
    }

    function exportTransaction() {
        dispatch(exportTransactions(transactionFilters))
    }

    return (
        <div className="flex justify-center items-start">
            <div className="h-fit max-h-[80vh] w-full flex flex-col gap-4 px-10">
                <div className="flex justify-between items-center gap-2">
                    <span className="text-xl font-semibold">Transactions</span>
                    <div className="flex items-center gap-x-3">
                        <Filters
                            applyFilters={filterChanges}
                            setFilterData={setFilterData}
                            transactionFilters={transactionFilters}
                        />
                        <Button variant="outline" onClick={exportTransaction}>
                            {!isExport ? (
                                <div className="flex gap-1 items-center">
                                    <FileDownIcon />
                                    <span>Export</span>
                                </div>
                            ) : (
                                <Loader2
                                    className="animate-spin"
                                    size={25}
                                    color="orange"
                                />
                            )}
                        </Button>
                        <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => setIsAddOpen(true)}
                        >
                            <Plus />
                            Add Transaction
                        </Button>
                    </div>
                </div>
                {searchParams.size > 0 && (
                    <FiltersChip
                        transactionFilters={transactionFilters}
                        clearFilter={clearFilter}
                    />
                )}
                <div className=" bg-white rounded-lg py-4 px-4 overflow-y-auto">
                    <Table>
                        <TableHeader className="[&_tr]:!border-0 bg-slate-200">
                            <TableRow>
                                <TableHead className="text-slate-800 font-medium">
                                    Transaction amount
                                </TableHead>
                                <TableHead className="text-slate-800 font-medium">
                                    Transaction Date
                                </TableHead>
                                <TableHead className="text-slate-800 font-medium">
                                    Transaction Description
                                </TableHead>
                                <TableHead className="text-slate-800 font-medium">
                                    Transaction Type
                                </TableHead>
                                <TableHead className="text-slate-800 font-medium">
                                    Category
                                </TableHead>
                                <TableHead className="w-12 text-slate-800 font-medium text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&_tr]:!border-l-0 [&_tr]:!border-r-0">
                            {transactions.map((transaction) => (
                                <TableRow
                                    key={transaction._id}
                                    className="border-b-slate-100"
                                >
                                    <TableCell className="text-slate-800 font-medium">
                                        {transaction.amount}
                                    </TableCell>
                                    <TableCell className="text-slate-800 font-normal">
                                        {transaction.date}
                                    </TableCell>
                                    <TableCell className="text-slate-800 font-normal">
                                        {transaction.description}
                                    </TableCell>
                                    <TableCell className="text-slate-800 font-normal">
                                        {transaction.transaction_type}
                                    </TableCell>
                                    <TableCell className="text-slate-800 font-normal">
                                        {categories.map((category) => {
                                            if (
                                                category._id ==
                                                transaction.category_id
                                            ) {
                                                return category.name
                                            }
                                        })}
                                    </TableCell>
                                    <TableCell className="flex justify-center items-center gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setData(transaction)
                                                setIsOpen(true)
                                            }}
                                            className="w-10 hover:bg-slate-100"
                                        >
                                            <Pencil />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="w-10"
                                            onClick={() => {
                                                setData(transaction)
                                                setIsDeleteOpen(true)
                                            }}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <EditTransactionForm
                    isOpen={isOpen}
                    toggle={toggle}
                    data={data}
                />
                <TransactionDelete
                    isDeleteOpen={isDeleteOpen}
                    deleteToggle={deleteToggle}
                    data={data}
                />
                <AddTransaction isAddOpen={isAddOpen} addToggle={addToggle} />
            </div>
        </div>
    )
}
