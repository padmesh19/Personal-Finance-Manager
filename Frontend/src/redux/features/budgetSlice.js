import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from './api/api'

export const fetchBudget = createAsyncThunk('/fetchBudget', async (filters) => {
    let url = '/budgets?'
    if (filters) {
        const { start_date, end_date, transaction_type, category_id } = filters
        if (start_date) url += `start_date=${start_date}&`
        if (end_date) url += `end_date=${end_date}&`
        if (transaction_type) url += `transaction_type=${transaction_type}&`
        if (category_id) url += `category_id=${category_id}&`
    }
    url = url.slice(0, -1)
    const response = await api.get(url)
    return response.data
})

export const exportBudgets = createAsyncThunk(
    '/exportBudgets',
    async (filters) => {
        try {
            let url = '/budgets/download?'
            if (filters) {
                const { start_date, end_date, transaction_type, category_id } =
                    filters
                if (start_date) url += `start_date=${start_date}&`
                if (end_date) url += `end_date=${end_date}&`
                if (transaction_type)
                    url += `transaction_type=${transaction_type}&`
                if (category_id) url += `category_id=${category_id}&`
            }
            url = url.slice(0, -1)

            const response = await api.get(url, { responseType: 'blob' })

            const blob = new Blob([response.data], {
                type: 'application/pdf',
            })

            const file_url = window.URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = file_url
            a.download = 'budgets.pdf'
            document.body.appendChild(a)
            a.click()

            window.URL.revokeObjectURL(file_url)

            return true
        } catch (error) {
            console.log(error)
        }
    }
)

export const addBudget = createAsyncThunk('/addBudget', async (data) => {
    const response = await api.post('/budgets', data)
    return response.data
})

export const updateBudget = createAsyncThunk(
    '/updateBudget',
    async ({ id, data }) => {
        const response = await api.put(`/budgets/${id}`, data)
        return response.data
    }
)

export const deleteBudget = createAsyncThunk('/deleteBudget', async (id) => {
    const response = await api.delete(`/budgets/${id}`)
    return response.data
})

const budgetSlice = createSlice({
    name: 'budgets',
    initialState: {
        budgets: [],
        isLoading: false,
        isExport: false,
        error: null,
    },
    reducers: {
        clearBudget: (state) => {
            state.budgets = null
            console.log('hi',state.budgets)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudget.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchBudget.fulfilled, (state, action) => {
                state.isLoading = false
                state.budgets = action.payload
            })
            .addCase(fetchBudget.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message
            })
            .addCase(exportBudgets.pending, (state) => {
                state.isExport = true
            })
            .addCase(exportBudgets.fulfilled, (state) => {
                state.isExport = false
            })
            .addCase(exportBudgets.rejected, (state, action) => {
                state.error = action.error.message
                state.isExport = false
            })
            .addCase(addBudget.fulfilled, (state, action) => {
                state.budgets.unshift(action.payload)
            })
            .addCase(updateBudget.fulfilled, (state, action) => {
                const index = state.budgets.findIndex(
                    (budget) => budget._id === action.payload._id
                )
                if (index !== -1) state.budgets[index] = action.payload
            })
            .addCase(deleteBudget.fulfilled, (state, action) => {
                state.budgets = state.budgets.filter(
                    (budget) => budget._id !== action.payload
                )
            })
    },
})

export const { clearBudget } = budgetSlice.actions;

export const budgetState = (state) => state.budget;

export default budgetSlice.reducer
