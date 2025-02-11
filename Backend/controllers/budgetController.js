const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const moment = require("moment");
const PdfPrinter = require("pdfmake");
const fs = require("fs");

const fonts = {
  Roboto: {
    normal: "pdfs/fonts/Roboto-Regular.ttf",
    bold: "pdfs/fonts/Roboto-Medium.ttf",
    italics: "pdfs/fonts/Roboto-Italic.ttf",
  },
};

const printer = new PdfPrinter(fonts);

const getBudgetbyUser = async (id) => {
  return await Budget.aggregate([
    {
      $match: {
        user_id: { $eq: id },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        category: 1,
        _id: 1,
        period: {
          startDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$period.startDate",
            },
          },
          endDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$period.endDate",
            },
          },
        },
        category_id: 1,
        user_id: 1,
        amount: 1,
        spent: 1,
      },
    },
  ]);
};

const budgetController = {
  // Get Budgets
  getBudgets: async (req, res) => {
    try {
      const user_id = req.user._id;
      const { start_date, end_date, category_id } = req.query;
      const matchConditions = {
        user_id: { $eq: user_id },
      };

      if (start_date) {
        matchConditions["period.startDate"] = { $gte: new Date(start_date) };
      }

      if (end_date) {
        matchConditions["period.endDate"] = { $lte: new Date(end_date) };
      }

      if (category_id) {
        matchConditions.category_id = {
          $eq: new mongoose.Types.ObjectId(category_id),
        };
      }
      const budgets = await Budget.aggregate([
        {
          $match: matchConditions,
        },
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            category: 1,
            _id: 1,
            period: {
              startDate: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$period.startDate",
                },
              },
              endDate: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$period.endDate",
                },
              },
            },
            category_id: 1,
            user_id: 1,
            amount: 1,
            spent: 1,
          },
        },
      ]);

      if (!budgets) return res.status(404).json({ message: "No Data" });
      res.status(200).json(budgets);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Add Budget
  addBudget: async (req, res) => {
    const user_id = req.user._id;
    const { amount, spent, startDate, endDate, category_id } = req.body;
    const start_date = moment(startDate).format("YYYY-MM-DD");
    const end_date = moment(endDate).format("YYYY-MM-DD");
    try {
      const budget = new Budget({
        user_id: user_id,
        amount,
        spent,
        period: { startDate: start_date, endDate: end_date },
        category_id,
      });
      const existingBudget = await Budget.findOne({
        category_id,
        $or: [
          {
            "period.startDate": { $lt: endDate },
            "period.endDate": { $gt: startDate },
          },
          { "period.startDate": { $gte: startDate, $lte: endDate } },
          { "period.endDate": { $gte: startDate, $lte: endDate } },
        ],
      });

      if (existingBudget) {
        return res.status(400).json({
          error:
            "A budget for this category already exists in the given date range.",
        });
      }

      await budget.save();
      const currBudget = await getBudgetbyUser(user_id);
      res.status(201).json(currBudget[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update Budget
  updateBudget: async (req, res) => {
    const user_id = req.user._id;
    const { amount, spent, startDate, endDate, category_id } = req.body;
    const start_date = moment(startDate).format("YYYY-MM-DD");
    const end_date = moment(endDate).format("YYYY-MM-DD");
    try {
      const budget_id = req.params.id;
      const budget = await Budget.findById(budget_id);
      if (!budget) return res.status(404).json({ message: "budget not found" });

      budget.amount = amount || budget.amount;
      budget.spent = spent || budget.spent;
      budget.period.startDate = start_date || budget.period.startDate;
      budget.period.endDate = end_date || budget.period.endDate;
      budget.category_id = category_id || budget.category_id;
      await budget.save();

      const currBudget = await Budget.aggregate([
        {
          $match: {
            _id: { $eq: budget._id },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $project: {
            category: 1,
            _id: 1,
            period: {
              startDate: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$period.startDate",
                },
              },
              endDate: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$period.endDate",
                },
              },
            },
            category_id: 1,
            user_id: 1,
            amount: 1,
            spent: 1,
          },
        },
      ]);
      res.status(200).json(currBudget[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Budget
  deleteBudget: async (req, res) => {
    try {
      const user_id = req.user._id;
      const budget_id = req.params.id;
      await Budget.findByIdAndDelete(budget_id);
      res.status(200).json(budget_id);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  exportBudgets: async (req, res) => {
    const user_id = req.user._id;
    const { start_date, end_date, category_id } = req.query;
    try {
      const matchConditions = {
        user_id: { $eq: user_id },
      };

      if (start_date) {
        matchConditions.period.startDate = { $gte: new Date(start_date) };
      }

      if (end_date) {
        matchConditions.period.endDate = matchConditions.period.endDate || {};
        matchConditions.period.endDate.$lte = new Date(end_date);
      }

      if (category_id) {
        matchConditions.category_id = {
          $eq: new mongoose.Types.ObjectId(category_id),
        };
      }

      const budgets = await Budget.aggregate([
        {
          $match: matchConditions,
        },
        { $sort: { date: -1, createdAt: -1 } },
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            category: 1,
            _id: 1,
            period: {
              startDate: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$period.startDate",
                },
              },
              endDate: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$period.endDate",
                },
              },
            },
            category_id: 1,
            user_id: 1,
            amount: 1,
            spent: 1,
          },
        },
      ]);

      if (!budgets.length) {
        return res.status(400).send("No data to export");
      }
      const pdfData = budgets.map((item) => {
        let row = [];
        row.push(item?.amount || "");
        row.push(item?.spent || "");
        row.push(item?.period?.startDate || "");
        row.push(item?.period?.endDate || "");
        row.push(item?.category?.[0]?.name || "");
        return row;
      });

      const docDefinition = {
        footer: function (currentPage, pageCount) {
          return currentPage.toString() + " of " + pageCount;
        },
        layout: "lightHorizontalLines",
        content: [
          { text: "Budgets", style: "header" },
          {
            text: "List of budget based on your filters",
            style: "subheader",
          },
          {
            style: "tableExample",
            table: {
              headerRows: 1,
              widths: ["*", "*", "auto", 100, "*"],
              body: [
                [
                  { text: "Amount", bold: true, fillColor: "#ddd" },
                  { text: "Spent", bold: true, fillColor: "#ddd" },
                  { text: "Start Date", bold: true, fillColor: "#ddd" },
                  { text: "End Date", bold: true, fillColor: "#ddd" },
                  { text: "Category", bold: true, fillColor: "#ddd" },
                ],
                ...pdfData,
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          subheader: {
            fontSize: 14,
            italics: true,
            margin: [0, 10, 0, 5],
          },
          tableExample: {
            margin: [0, 5, 0, 15],
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: "black",
          },
        },
      };
      const filePath = "pdfs/sample.pdf";
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(filePath));
      pdfDoc.end();
      const data = await new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
      fs.truncate(filePath, 0, function () {
        console.log("File is truncated !!!");
      });
      res.status(200).send(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = budgetController;
