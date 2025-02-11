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
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { categoryState } from '@/redux/features/categorySlice'

import { Filter } from 'lucide-react'
import {  useState } from 'react'
import { useSelector } from 'react-redux'


const SIDE = 'right'

export function Filters({ applyFilters, budgetFilters, setFilterData }) {
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
                    <SheetTitle>Budget Filters</SheetTitle>
                    <SheetDescription>
                        Filter your budgets here
                    </SheetDescription>
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
                                value={budgetFilters.category_id}
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
                        <Label htmlFor="spent" className="mb-2">
                            From Date
                        </Label>
                        <div className="col-span-3">
                            <DatePicker
                                value={budgetFilters?.start_date}
                                setValue={(val) => {
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
                                value={budgetFilters?.end_date}
                                setValue={(val) => {
                                    setFilterData('end_date', val)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <Button type="button" onClick={filterSubmit}>
                        Save changes
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
