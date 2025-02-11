const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const Transaction = require("../models/Transaction");
const moment = require("moment");

const fonts = {
  Roboto: {
    normal: "pdfs/fonts/Roboto-Regular.ttf",
    bold: "pdfs/fonts/Roboto-Medium.ttf",
    italics: "pdfs/fonts/Roboto-Italic.ttf",
  },
};

const printer = new PdfPrinter(fonts);

const transactionController = {
  // Get Transactions
  getTransactions: async (req, res) => {
    const user_id = req.user._id;
    const { start_date, end_date, transaction_type, category_id } = req.query;
    try {
      const matchConditions = {
        user_id: { $eq: user_id },
      };

      if (start_date) {
        matchConditions.date = { $gte: new Date(start_date) };
      }

      if (end_date) {
        matchConditions.date = matchConditions.date || {};
        matchConditions.date.$lte = new Date(end_date);
      }

      if (transaction_type) {
        matchConditions.transaction_type = { $eq: transaction_type };
      }

      if (category_id) {
        matchConditions.category_id = {
          $eq: new mongoose.Types.ObjectId(category_id),
        };
      }

      const transactions = await Transaction.aggregate([
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
        {
          $project: {
            category: 1,
            user_id: 1,
            _id: 1,
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date",
              },
            },
            amount: 1,
            description: 1,
            transaction_type: 1,
            category_id: 1,
          },
        },
      ]);
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //Get a Transaction

  getTransaction: async (req, res) => {
    try {
      const transaction_id = req.params.id;
      const transaction = await Transaction.findById(transaction_id).select(
        "-__v"
      );
      if (!transaction)
        return res.status(404).json({ message: "Transaction not found" });
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add Transaction
  addTransaction: async (req, res) => {
    const user_id = req.user._id;
    const { amount, date, description, transaction_type, category_id } =
      req.body;
    const transaction_date = moment(date).format("YYYY-MM-DD");
    try {
      const transaction = new Transaction({
        user_id,
        category_id,
        amount,
        date: transaction_date,
        description,
        transaction_type,
      });
      await transaction.save()
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update Transaction
  updateTransaction: async (req, res) => {
    const transaction_id = req.params.id;
    const { amount, date, description, transaction_type, category_id } =
      req.body;
    const transaction_date = moment(date).format("YYYY-MM-DD");
    try {
      const transaction = await Transaction.findById(transaction_id);
      if (!transaction)
        return res.status(404).json({ message: "Transaction not found" });

      transaction.category_id = category_id || transaction.category_id;
      transaction.amount = amount || transaction.amount;
      transaction.date = transaction_date || transaction.date;
      transaction.description = description || transaction.description;
      transaction.transaction_type =
        transaction_type || transaction.transaction_type;
      await transaction.save();

      const transactions = await Transaction.aggregate([
        {
          $match: {
            _id: { $eq: transaction._id },
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
            user_id: 1,
            _id: 1,
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date",
              },
            },
            amount: 1,
            description: 1,
            transaction_type: 1,
          },
        },
      ]);
      res.status(200).json(transactions[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Transaction
  deleteTransaction: async (req, res) => {
    try {
      const transaction_id = req.params.id;
      await Transaction.findByIdAndDelete(transaction_id);
      res.status(200).json(transaction_id);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  exportTransactions: async (req, res) => {
    const user_id = req.user._id;
    const { start_date, end_date, transaction_type, category_id } = req.query;
    try {
      const matchConditions = {
        user_id: { $eq: user_id },
      };

      if (start_date) {
        matchConditions.date = { $gte: new Date(start_date) };
      }

      if (end_date) {
        matchConditions.date = matchConditions.date || {};
        matchConditions.date.$lte = new Date(end_date);
      }

      if (transaction_type) {
        matchConditions.transaction_type = { $eq: transaction_type };
      }

      if (category_id) {
        matchConditions.category_id = {
          $eq: new mongoose.Types.ObjectId(category_id),
        };
      }

      const transactions = await Transaction.aggregate([
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
        {
          $project: {
            amount: 1,
            date: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$date",
              },
            },
            description: 1,
            transaction_type: 1,
            category_id: 1,
            category: 1,
          },
        },
      ]);

      if (!transactions.length) {
        return res.status(400).send("No data to export");
      }
      const pdfData = transactions.map((item) => {
        let row = [];
        row.push(item?.amount || "");
        row.push(item?.date || "");
        row.push(item?.description || "");
        row.push(item?.transaction_type || "");
        row.push(item?.category?.[0]?.name || "");
        return row;
      });

      const docDefinition = {
        footer: function (currentPage, pageCount) {
          return currentPage.toString() + " of " + pageCount;
        },
        layout: "lightHorizontalLines",
        content: [
          { text: "Transactions", style: "header" },
          {
            text: "List of transaction based on your filters",
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
                  { text: "Date", bold: true, fillColor: "#ddd" },
                  { text: "Description", bold: true, fillColor: "#ddd" },
                  { text: "Type", bold: true, fillColor: "#ddd" },
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

module.exports = transactionController;
