import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { LogOut, Menu, User2 } from 'lucide-react'
import {
    Link,
    NavLink,
    replace,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { clearUser, userState } from '@/redux/features/userSlice'
import authServices from '@/services/authServices'
import { toast } from 'react-toastify'

export function Navbar() {
    const [state, setState] = useState(false)
    const { user } = useSelector(userState)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const menus = [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Transactions', path: '/transaction' },
        { title: 'Budgets', path: '/budget' },
        { title: 'Categories', path: '/category' },
        { title: 'Goals', path: '/goal' },
    ]

    const logoutUser = async () => {
        try {
            const response = await authServices.logout()
            toast.success('Logout Successful')
            dispatch(clearUser())
            navigate('/auth/login', {
                replace: true,
                state: { from: location },
            })
        } catch (error) {
            toast.error('Something went wrong...')
        }
    }

    return (
        <nav className="bg-white w-full border-b md:border-0 z-50 fixed shadow-sm">
            {user ? (
                <div className="items-center px-4 mx-auto md:flex md:px-8 justify-between">
                    <div className="flex items-center justify-between py-3 md:py-4 md:block">
                        <Link to="/dashboard" className="cursor-pointer comic ">
                            <div className="flex flex-col items-center">
                                <p className="text-slate-700 text-base font-bold">
                                    Finance
                                </p>
                                <p className="text-2xl leading-none font-semibold text-orange-500">
                                    Manager
                                </p>
                            </div>
                        </Link>
                        <div className="md:hidden flex gap-3">
                            <div className="md:hidden">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        asChild
                                        className="cursor-pointer "
                                    >
                                        <Avatar>
                                            <AvatarFallback className="bg-slate-600 text-white">
                                                {user?.name
                                                    .charAt(0)
                                                    .toLocaleUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="min-w-44">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                navigate('/profile'),
                                                    { replace: true }
                                            }}
                                            className="!hover:bg-zinc-950 !hover:text-white w-full cursor-pointer text-left"
                                        >
                                            <User2 />
                                            <div className="font-medium hover:text-orange-500 w-full">
                                                My Profile
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem
                                            onClick={logoutUser}
                                            className="!hover:bg-zinc-950 !hover:text-white w-full cursor-pointer text-left"
                                        >
                                            <LogOut />
                                            <div className="font-medium hover:text-orange-500 w-full">
                                                Logout
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <button
                                className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 "
                                onClick={() => setState(!state)}
                            >
                                <Menu />
                            </button>
                        </div>
                    </div>
                    <div
                        className={`flex justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                            state ? 'block' : 'hidden'
                        }`}
                    >
                        <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0 gap-5">
                            {menus.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="text-gray-600 hover:text-orange-400"
                                >
                                    <NavLink
                                        to={item.path}
                                        onClick={() => setState(false)}
                                        className={({ isActive }) =>
                                            [
                                                'pb-3',
                                                isActive
                                                    ? 'text-orange-500'
                                                    : '',
                                            ].join(' ')
                                        }
                                    >
                                        {item.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="justify-end hidden md:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                asChild
                                className="cursor-pointer  "
                            >
                                <Avatar>
                                    <AvatarFallback className="bg-slate-600 text-white">
                                        {user?.name
                                            .charAt(0)
                                            .toLocaleUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-44">
                                <DropdownMenuItem
                                    onClick={() => {
                                        navigate('/profile'), { replace: true }
                                    }}
                                    className="!hover:bg-zinc-950 !hover:text-white w-full cursor-pointer text-left"
                                >
                                    <User2 />
                                    <div className="font-medium hover:text-orange-500 w-full">
                                        My Profile
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={logoutUser}
                                    className="!hover:bg-zinc-950 !hover:text-white w-full cursor-pointer text-left"
                                >
                                    <LogOut />
                                    <div className="font-medium hover:text-orange-500 w-full">
                                        Logout
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ) : null}
        </nav>
    )
}
