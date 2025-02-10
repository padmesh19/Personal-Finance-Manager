const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const { FRONTEND_URL } = require('./utils/config');
const budgetRouter = require('./routes/budgetRoutes');
const goalRouter = require('./routes/goalRoutes');
const transactionRouter = require('./routes/transactionRoute');
const dashboardRouter = require('./routes/dashboardRouter')

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(
  cors({
    origin: FRONTEND_URL, 
    credentials: true,
    optionSuccessStatus: 200,
  })
);


app.use('/api/v1/auth', authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/budgets", budgetRouter);
app.use("/api/v1/goals", goalRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/dashboard", dashboardRouter);

module.exports = app;