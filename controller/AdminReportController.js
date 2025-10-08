const db = require("../config/DB-Config");
const {
  graphDataSQL,
  piechartSQL,
  getDashbordReportSQL,
} = require("../models/AdminReportSQL");
const capitalizeFirstLetter = require("../utils/CapitalizeFirstLetter");

const getDashBoardReport = async (req, res) => {
  try {
    const reportSql = getDashbordReportSQL;
    const totalCustomersSql = `SELECT COUNT(*) AS total_customers FROM user_detail;`;
    const totalOrdersSql = `SELECT COUNT(*) AS total_orders FROM product_order;`;
    const [reportResult, customerResult, ordersResult] = await Promise.all([
      db.query(reportSql),
      db.query(totalCustomersSql),
      db.query(totalOrdersSql),
    ]);
    const row = {
      ...reportResult.rows[0],
      total_customers: customerResult.rows[0].total_customers,
      total_orders: ordersResult.rows[0].total_orders,
    };
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching all customer products",
      error: err.message,
    });
  }
};
const getAdminDetail = async (req, res) => {
  try {
    const sql = `
      SELECT
        first_name,
        last_name,
        role
      FROM user_Detail 
      WHERE role = 'admin';
    `;
    const result = await db.query(sql);

    if (!result.rows || result.rows.length === 0) {
      return res.status(204).json({ message: "No Admin Found" });
    }
    const formatted = {
      ...result.rows[0],
      role: capitalizeFirstLetter(result.rows[0].role),
    };
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching Admin for Header",
      error: err.message,
    });
  }
};

const graphData = async (req, res) => {
  try {
    const sql = graphDataSQL;

    const result = await db.query(sql);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching weekly revenue data",
      error: err.message,
    });
  }
};

const pieChart = async (req, res) => {
  try {
    const sql = piechartSQL;
    const result = await db.query(sql);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching top product sales",
      error: err.message,
    });
  }
};

module.exports = { getAdminDetail };

module.exports = { getDashBoardReport, getAdminDetail, graphData, pieChart };
