const db = require("../config/DB-Config");
const bcrypt = require("bcrypt");
const amountConvert = require("../utils/AmountConvert");
const dateConversion = require("../utils/DateConvert");
const {
  getAllCustomerDetailSQL,
  customerDetailSQL,
} = require("../models/CustomerSQL");

const getAllCustomerDetails = async (req, res) => {
  try {
    const sql = getAllCustomerDetailSQL;
    const result = await db.query(sql);
    const formatted = result.rows.map((row) => ({
      ...row,
      totalSpent: amountConvert(row.totalspent),
      lastOrder: row.lastorder ? dateConversion(row.lastorder) : "Nill",
    }));
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching all customer ",
      error: err.message,
    });
  }
};

const addNewCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      streetAddress,
      city,
      state,
      pincode,
      country,
      addressType,
      role,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userSql = `
      INSERT INTO user_Detail (first_name, last_name, email, password, phone_number, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, first_name, last_name, email, role
    `;
    const userValues = [
      firstName,
      lastName,
      email,
      hashedPassword,
      phone.toString(),
      role,
    ];
    const userResult = await db.query(userSql, userValues);

    const userId = userResult.rows[0].user_id;

    const locationSql = `
      INSERT INTO user_location ( address, pincode,user_id, address_type)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const locationValues = [
      streetAddress + ", " + city + ", " + state + ", " + country,
      pincode,
      userId,
      addressType,
    ];
    await db.query(locationSql, locationValues);

    res.status(201).json({
      message: "Customer added successfully",
      customer: userResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const customerDetail = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const sql = customerDetailSQL;
    const result = await db.query(sql, [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customer = result.rows[0];
    customer.totalspent = Number(customer.totalspent || 0);
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching customer details",
      error: err.message,
    });
  }
};

const updateCustomerStatus = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { status } = req.body;
    const sql = `
      UPDATE user_Detail
      SET status=$1
      WHERE user_id=$2;
    `;
    await db.query(sql, [status, userId]);
    res
      .status(202)
      .json({ message: `Successfully ${status} customer acount ` });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while update status",
      error: err.message,
    });
  }
};

module.exports = {
  getAllCustomerDetails,
  addNewCustomer,
  customerDetail,
  updateCustomerStatus,
};
