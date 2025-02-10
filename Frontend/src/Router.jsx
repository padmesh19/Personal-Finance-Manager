import { createBrowserRouter } from 'react-router'

import Register from './pages/Auth/Register'
import Dashboard from './pages/Auth/Dashboard'
import Login from './pages/Auth/Login'
import BudgetList from './pages/budget/BudgetList'
import CategoryList from './pages/category/categoryList'
import ProtectedRoute from './ProtectedRoutes'
import Layout from './layouts/Layout'
import TransactionList from './pages/transaction/TransactionList'
import GoalList from './pages/goal/GoalList'
import AuthLayout from './layouts/AuthLayout'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import OTPverification from './pages/Auth/OTPVerfication'
import Profile from './pages/Auth/Profile/Profile'
const routes = [
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />,
            },
            {
                path: 'reset-password',
                element: <ResetPassword />,
            },
            {
                path: 'otp-verification',
                element: <OTPverification />,
            },
        ],
    },
    {
        path: '/',
        element: (
            <Layout>
                <ProtectedRoute />
            </Layout>
        ),
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'category',
                element: <CategoryList />,
            },
            {
                path: 'budget',
                element: <BudgetList />,
            },
            {
                path: 'transaction',
                element: <TransactionList />,
            },
            {
                path: 'goal',
                element: <GoalList />,
            },
        ],
    },
]

const router = createBrowserRouter(routes, {
    future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
    },
})

export default router
