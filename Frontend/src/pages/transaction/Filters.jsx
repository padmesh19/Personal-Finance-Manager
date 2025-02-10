import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/datepicker'

import { Label } from '@/components/ui/label'
import {
    SelectTrigger,
    Select,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { categoryState } from '@/redux/features/categorySlice'

import { Filter } from 'lucide-react'
import {  useState } from 'react'
import { useSelector } from 'react-redux'


const SIDE = 'right'
const TRANSACTION_TYPE = [
    'income',
    'expense'
]

export function Filters({ applyFilters, transactionFilters, setFilterData }) {
    const { categories } = useSelector(categoryState)
    const [open, setOpen] = useState(false)

    const filterSubmit = () =>{
        applyFilters();
        setOpen(false);
    }

    return (
        <Sheet key={SIDE} onOpenChange={(value) => setOpen(value)} open={open}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <Filter />
                </Button>
            </SheetTrigger>
            <SheetContent side={SIDE}>
                <SheetHeader>
                    <SheetTitle>Transaction Filters</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-8 py-8">
                    <div className="flex flex-col w-full">
                        <Label htmlFor="" className="mb-2">
                            Category
                        </Label>
                        <div className="col-span-3">
                            <Select
                                onValueChange={(e) =>
                                    setFilterData('category_id', e)
                                }
                                value={transactionFilters.category_id}
                            >
                                <SelectTrigger className="h-9 bg-white">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <Label htmlFor="" className="mb-2">
                            Transaction Type
                        </Label>
                        <div className="col-span-3">
                            <Select
                                onValueChange={(e) =>
                                    setFilterData('transaction_type', e)
                                }
                                value={transactionFilters.transaction_type}
                            >
                                <SelectTrigger className="h-9 bg-white">
                                    <SelectValue placeholder="Select a transaction type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TRANSACTION_TYPE.map((transaction) => (
                                        <SelectItem
                                            key={transaction}
                                            value={transaction}
                                        >
                                            {transaction}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <Label htmlFor="spent" className="mb-2">
                            From Date
                        </Label>
                        <div className="col-span-3">
                            <DatePicker
                                value={transactionFilters?.start_date}
                                setValue={(val) => {
                                    console.log(val)
                                    setFilterData('start_date', val)
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <Label htmlFor="spent" className="mb-2">
                            To Date
                        </Label>
                        <div className="col-span-3">
                            <DatePicker
                                value={transactionFilters?.end_date}
                                setValue={(val) => {
                                    setFilterData('end_date', val)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <SheetFooter>
                        <Button type="button" onClick={filterSubmit}>Save changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
