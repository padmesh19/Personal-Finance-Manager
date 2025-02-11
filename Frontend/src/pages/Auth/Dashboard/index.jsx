import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import {
    Loader2,
    MoveDownLeft,
    MoveUpRight,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import Cards from './components/Cards'
import { IncomeExpenseChart } from './components/IncomeExpenseChart'
import { useEffect, useState } from 'react'
import { fetchData } from '@/redux/features/dashboardSlice'
import { useSearchParams } from 'react-router-dom'

const Dashboard = () => {
    const dispatch = useDispatch()
    const { transactions } = useSelector((state) => state.transaction)
    const { dashboard, isLoading } = useSelector((state) => state.dashboard)

    // Using search params to store month and year
    const [searchParams, setSearchParams] = useSearchParams()
    const currentMonth = searchParams.get('month') || moment().format('MM')
    const currentYear = searchParams.get('year') || moment().format('YYYY')

    const currentDate = moment(`${currentYear}-${currentMonth}-01`)

    const handlePreviousMonth = () => {
        const newDate = moment(currentDate).subtract(1, 'month')
        setSearchParams({
            month: newDate.format('MM'),
            year: newDate.format('YYYY'),
        })
    }

    const handleNextMonth = () => {
        const newDate = moment(currentDate).add(1, 'month')
        setSearchParams({
            month: newDate.format('MM'),
            year: newDate.format('YYYY'),
        })
    }

    const startOfMonth = currentDate.startOf('month').format('YYYY-MM-DD')
    const endOfMonth = currentDate.endOf('month').format('YYYY-MM-DD')

    const filteredTransactions = transactions?.filter((transaction) =>
        moment(transaction.date).isBetween(startOfMonth, endOfMonth, null, '[]')
    )

    useEffect(() => {
        dispatch(fetchData(currentMonth, currentYear))
    }, [dispatch, currentMonth, currentYear])
    return (
        <>
            {!isLoading ? (
                <div className="lg:px-10 px-4 pt-4 pb-10 min-w-screen flex flex-col gap-4">
                    {/* Dashboard Heading with Month Navigation */}
                    <div className="flex justify-between items-center">
                        <span className="text-3xl font-semibold text-slate-700">
                            Dashboard
                        </span>
                        <div className="flex items-center text-white gap-1">
                            <button
                                className="bg-slate-500 hover:bg-slate-600 p-1 rounded-md"
                                onClick={handlePreviousMonth}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <span className="px-3 rounded-md font-semibold bg-slate-600 py-1 font-mono uppercase">
                                {currentDate.format('MMM YYYY')}
                            </span>
                            <button
                                className="bg-slate-500 hover:bg-slate-600 p-1 rounded-md"
                                onClick={handleNextMonth}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="flex gap-8 w-full flex-col">
                        <div className="w-full flex flex-col-reverse sm:flex-row gap-4 justify-between">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-8">
                                {dashboard &&
                                    Object.entries(dashboard).map(
                                        ([key, value], index) => (
                                            <Cards
                                                key={index}
                                                item={{ key, value }}
                                            />
                                        )
                                    )}
                            </div>
                            <div className="w-full max-w-[400px]">
                                {dashboard && (
                                    <IncomeExpenseChart data={dashboard} />
                                )}
                            </div>
                        </div>

                        {/* Transactions Section */}
                        <div className="flex w-full gap-6">
                            <div className="flex flex-col w-full">
                                <div className="text-2xl font-medium text-slate-700 mb-4">
                                    Transactions
                                </div>
                                <div className="flex bg-white sm:px-6 py-4 w-full border border-slate-100">
                                    <div className="w-full">
                                        {filteredTransactions && (
                                            <div className="flex flex-col gap-6">
                                                {filteredTransactions?.map(
                                                    (item) => (
                                                        <div
                                                            key={item._id}
                                                            className="flex justify-between border-b border-b-slate-100 px-4 py-2"
                                                        >
                                                            <div className="w-[35%] flex gap-2 items-center">
                                                                {item.transaction_type ===
                                                                'income' ? (
                                                                    <MoveDownLeft
                                                                        color="#2eb82e"
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <MoveUpRight
                                                                        color="#e60000"
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                )}
                                                                <div>
                                                                    {
                                                                        item?.description
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="w-[25%]">
                                                                {item
                                                                    ?.category?.[0]
                                                                    ?.name ||
                                                                    'Uncategorized'}
                                                            </div>
                                                            <div
                                                                className={`w-[25%] ${
                                                                    item.transaction_type ===
                                                                    'expense'
                                                                        ? 'text-[#e60000]'
                                                                        : 'text-[#2eb82e]'
                                                                }`}
                                                            >
                                                                {item?.transaction_type
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    item?.transaction_type.slice(
                                                                        1
                                                                    )}
                                                            </div>
                                                            <div className="w-[15%] text-slate-500">
                                                                ₹ {item?.amount}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                        {!filteredTransactions.length && (
                                            <div className=" bg-white min-h-[10vh] rounded-lg py-4 px-4 overflow-y-auto flex items-center justify-center">
                                                <div className="max-h-screen h-full no-scrollbar">
                                                    <div className="text-slate-700 text-bold text-xl">
                                                        No Transaction Data
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-[80vh] no-scrollbar flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <Loader2
                            className="animate-spin"
                            size={40}
                            color="orange"
                        />
                        <div className="text-slate-700 text-semibold text-md">
                            Loading...
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dashboard
