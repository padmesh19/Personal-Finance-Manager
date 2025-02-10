import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import { Loader2, MoveDownLeft, MoveUpRight } from 'lucide-react'
import Cards from './components/Cards'
import { IncomeExpenseChart } from './components/IncomeExpenseChart'
import { useEffect } from 'react'
import { fetchData } from '@/redux/features/dashboardSlice'

const Dashboard = () => {
    const dispatch = useDispatch()
    const { transactions } = useSelector((state) => state.transaction)
    const { dashboard, isLoading } = useSelector((state) => state.dashboard)

    const today = moment().format('YYYY-MM-DD')
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')

    let todayTransactions = null,
        yesterdayTransactions = null
    if (transactions && transactions?.length) {
        todayTransactions = transactions?.filter(
            (transaction) => transaction.date === today
        )

        yesterdayTransactions = transactions.filter(
            (transaction) => transaction.date === yesterday
        )
    }
    useEffect(() => {
        dispatch(fetchData())
    }, [dispatch])
    return (
        <>
            {!isLoading ? (
                <div className="lg:px-10 px-4 pt-4 pb-10 min-w-screen flex flex-col gap-4">
                    <span className="text-3xl font-semibold text-slate-700">
                        Dashboard
                    </span>
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
                        <div className="flex w-full gap-6">
                            <div className="flex flex-col w-full">
                                <div className="text-2xl font-medium text-slate-700 mb-4">
                                    Transactions
                                </div>
                                <div className="flex bg-white sm:px-6 py-4 w-full border border-slate-100">
                                    <div className="w-full">
                                        <div className="flex flex-col gap-6">
                                            {todayTransactions?.length > 0 && (
                                                <div>
                                                    <div className="border-b border-b-slate-200 pb-2 text-orange-500 font-medium px-4">
                                                        Today
                                                    </div>
                                                    {todayTransactions.map(
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
                                                                    <div className="">
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
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        item?.transaction_type.slice(
                                                                            1
                                                                        )}
                                                                </div>
                                                                <div className="w-[15%] text-slate-500">
                                                                    ₹{' '}
                                                                    {
                                                                        item?.amount
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            {yesterdayTransactions?.length >
                                                0 && (
                                                <div>
                                                    <div className="border-b border-b-slate-200 pb-2 text-orange-500 font-medium px-4">
                                                        <div>Yesterday</div>
                                                    </div>

                                                    {yesterdayTransactions.map(
                                                        (item) => (
                                                            <div
                                                                key={item._id}
                                                                className="flex justify-between border-b border-b-slate-100 px-4 py-2 text-slate-600 font-normal"
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
                                                                    <div className="">
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
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        item?.transaction_type.slice(
                                                                            1
                                                                        )}
                                                                </div>
                                                                <div className="w-[15%] text-slate-500">
                                                                    ₹{' '}
                                                                    {
                                                                        item?.amount
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
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
