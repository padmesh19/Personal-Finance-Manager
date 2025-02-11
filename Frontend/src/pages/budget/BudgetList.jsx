import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, FileDownIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BudgetForm from './BudgetForm'
import BudgetDelete from './BudgetDelete'
import AddBudgetForm from './AddBudgetForm'
import { useDispatch, useSelector } from 'react-redux'
import { categoryState } from '@/redux/features/categorySlice'
import { useSearchParams } from 'react-router-dom'
import { exportBudgets, fetchBudget } from '@/redux/features/budgetSlice'
import { Filters } from './Filters'
import { Badge } from '@/components/ui/badge'

import { format } from 'date-fns'

const FiltersChip = ({ categories, budgetFilters, clearFilter }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {Object.keys(budgetFilters).map((key) => {
                if (budgetFilters[key]) {
                    let displayValue = budgetFilters[key]
                    let displayName = key
                    switch (key) {
                        case 'start_date':
                            displayValue = format(
                                new Date(budgetFilters[key]),
                                'PPP'
                            )
                            displayName = 'Start Date'
                            break
                        case 'end_date':
                            displayValue = format(
                                new Date(budgetFilters[key]),
                                'PPP'
                            )
                            displayName = 'End Date'
                            break
                        case 'category_id':
                            displayName = 'Category'
                            let categoryName = ''
                            categories.forEach((category) => {
                                if (category._id == budgetFilters[key]) {
                                    categoryName = category.name
                                }
                            })
                            displayValue = categoryName
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

export default function BudgetList() {
    const { budgets, isExport, isLoading, error } = useSelector(
        (state) => state.budget
    )
    const { categories } = useSelector(categoryState)
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()
    const [currCategory, setCurrCategory] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [data, setData] = useState(null)
    const [budgetFilters, setBudgetFilters] = useState({
        start_date: data?.start_date || '',
        end_date: data?.end_date || '',
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
        setQueryParams(budgetFilters)
        dispatch(fetchBudget(budgetFilters))
    }

    const setFilterData = (key, value) => {
        setBudgetFilters((state) => ({ ...state, [key]: value }))
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
        dispatch(fetchBudget(filters))
    }

    function clearFilter(key) {
        setBudgetFilters((state) => ({ ...state, [key]: '' }))
        const filters = { ...budgetFilters, [key]: '' }
        const params = new URLSearchParams()
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                params.set(key, filters[key])
            }
        })
        setSearchParams(params)
        dispatch(fetchBudget(filters))
    }

    function exportBudget() {
        if (
    confirm(
                'The Filtered data will be exported. Click OK to export PDF?'
            )
        ) {
            dispatch(exportBudgets(budgetFilters))
        }
    }

    useEffect(() => {
        const expense_category = categories.filter(
            (data) => data.category_type == 'expense'
        )
        setCurrCategory(expense_category)
    }, [categories])

    return (
        <>
            <div className="flex justify-center items-start">
                <div className="h-fit max-h-[80vh] w-full flex flex-col gap-4 px-2 sm:px-10">
                    <div className="flex justify-between flex-col sm:flex-row items-center gap-2">
                        <span className="text-xl font-semibold">Budgets</span>
                        <div className="flex items-center gap-x-3">
                            <Filters
                                applyFilters={filterChanges}
                                setFilterData={setFilterData}
                                budgetFilters={budgetFilters}
                            />
                            <Button variant="outline" onClick={exportBudget}>
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
                                onClick={() => {
                                    setIsAddOpen(true)
                                }}
                            >
                                <Plus />
                                Add Budget
                            </Button>
                        </div>
                    </div>
                    {searchParams.size > 0 && (
                        <FiltersChip
                            categories={categories}
                            budgetFilters={budgetFilters}
                            clearFilter={clearFilter}
                        />
                    )}
                    {!!budgets.length && (
                        <div className=" bg-white rounded-lg py-4 px-4 overflow-y-auto">
                            <Table>
                                <TableHeader className="[&_tr]:!border-0 bg-slate-200">
                                    <TableRow>
                                        <TableHead className="text-slate-800 font-medium">
                                            Budget amount
                                        </TableHead>
                                        <TableHead className="text-slate-800 font-medium">
                                            Budget Type
                                        </TableHead>
                                        <TableHead className="text-slate-800 font-medium">
                                            Spent
                                        </TableHead>
                                        <TableHead className="text-slate-800 font-medium">
                                            Start Date
                                        </TableHead>
                                        <TableHead className="text-slate-800 font-medium">
                                            End Date
                                        </TableHead>
                                        <TableHead className="w-12 text-slate-800 font-medium text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="[&_tr]:!border-l-0 [&_tr]:!border-r-0">
                                    {budgets.map((budget) => (
                                        <TableRow
                                            key={budget._id}
                                            className="border-b-slate-100"
                                        >
                                            <TableCell className="text-slate-800 font-medium">
                                                {budget.amount}
                                            </TableCell>
                                            <TableCell className="text-slate-800 font-normal">
                                                {currCategory.map(
                                                    (category) => {
                                                        if (
                                                            category._id ==
                                                            budget.category_id
                                                        )
                                                            return category.name
                                                    }
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-800 font-normal">
                                                {budget.spent}
                                            </TableCell>
                                            <TableCell className="text-slate-800 font-normal">
                                                {budget.period.startDate}
                                            </TableCell>
                                            <TableCell className="text-slate-800 font-normal">
                                                {budget.period.endDate}
                                            </TableCell>
                                            <TableCell className="flex justify-center items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setData(budget)
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
                                                        setData(budget)
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
                    )}
                    {!budgets.length && (
                        <div className=" bg-white min-h-[70vh] rounded-lg py-4 px-4 overflow-y-auto flex items-center justify-center">
                            <div className="max-h-screen h-full no-scrollbar">
                                <div className="text-slate-700 text-bold text-xl">
                                    No Data
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <BudgetForm
                    isOpen={isOpen}
                    toggle={toggle}
                    data={data}
                    currCategory={currCategory}
                />
                <BudgetDelete
                    isDeleteOpen={isDeleteOpen}
                    deleteToggle={deleteToggle}
                    data={data}
                />
                <AddBudgetForm
                    isAddOpen={isAddOpen}
                    addToggle={addToggle}
                    currCategory={currCategory}
                />
            </div>
        </>
    )
}
