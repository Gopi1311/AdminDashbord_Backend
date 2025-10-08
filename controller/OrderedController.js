const db = require("../config/DB-Config");
const { orderTrackingSQL, notifySQL } = require("../models/OrdersSQL");
const amountConvert = require("../utils/AmountConvert");
const capitalizeFirstLetter = require("../utils/CapitalizeFirstLetter");
const dateConversion = require("../utils/DateConvert");

const getOrders = async (req, res) => {
  try {
    const orderStatus = req.query.status?.toLowerCase() || "";
    const limit = parseInt(req.query.limit) || null;

    let sql = `
      SELECT 
        po.order_id AS id,
        b.first_name,
        b.last_name,
        po.ordered_at AS date,
        po.order_status AS status,
        SUM(oi.item_price) AS amount,
        COUNT(oi.order_id) AS items,
        up.payment_status AS payment
      FROM product_order po
      JOIN user_detail b ON po.user_id = b.user_id
      Left JOIN order_items oi ON po.order_id = oi.order_id
      Left JOIN user_payment up ON po.order_id = up.order_id
    `;

    const values = [];

    if (orderStatus && orderStatus !== "all") {
      sql += ` WHERE LOWER(po.order_status::text) = $1`;
      values.push(orderStatus);
    }

    sql += `
      GROUP BY po.order_id, b.first_name, b.last_name, po.ordered_at, po.order_status, up.payment_status
      ORDER BY po.ordered_at DESC
    `;

    if (limit) {
      sql += ` LIMIT $${values.length + 1}`;
      values.push(limit);
    }

    const result = await db.query(sql, values);

    const formatted = result.rows.map((row) => ({
      ...row,
      date: dateConversion(row.date),
      status: capitalizeFirstLetter(row.status),
      payment: row.payment ? capitalizeFirstLetter(row.payment) : "Cash",
      amount: amountConvert(row.amount),
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching orders",
      error: err.message,
    });
  }
};

const orderTracking = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const sql = orderTrackingSQL;

    const result = await db.query(sql, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching orders tracking",
      error: err.message,
    });
  }
};

const notifyMessage = async (req, res) => {
  try {
    const result = await db.query(notifySQL);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No successful payments found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching notification" });
  }
};

module.exports = { getOrders, orderTracking, notifyMessage };
