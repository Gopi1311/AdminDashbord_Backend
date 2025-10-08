const db = require("../config/DB-Config");
const { singleProductSQL, getallProductSQL } = require("../models/ProductSQL");
const amountConvert = require("../utils/AmountConvert");

const getAllProduct = async (req, res) => {
  try {
    const sql = getallProductSQL;
    const result = await db.query(sql);
    const formatted = result.rows.map((row) => ({
      ...row,
      price: amountConvert(row.price),
      status: row.status > 0 ? "Active" : "InActive",
    }));
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching all order products",
      error: err.message,
    });
  }
};
const getProductCategory = async (req, res) => {
  try {
    const sql = `
        SELECT id,category_name
        FROM category;
      
    `;
    const result = await db.query(sql);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching all products category",
      error: err.message,
    });
  }
};

const addNewProduct = async (req, res) => {
  try {
    const {
      product_name,
      brand,
      product_image,
      description,
      price,
      stock_quantity,
      is_refurbished,
      seller_id = 11,
      category,
      highlights,
      general_spec,
      discount_start_date,
      discount_end_date,
      is_active,
      coupon_code,
      discount_description,
      discount_type,
      discount_price,
      min_purchase,
      usage_limit,
    } = req.body;

    const product_imagebuffer = req.file ? req.file.buffer : null;

    // Insert into product_detail
    const product_detail = [
      product_name,
      brand,
      product_imagebuffer,
      description,
      price,
      stock_quantity,
      is_refurbished,
      seller_id,
      category,
    ];

    const product_detail_sql = `
      INSERT INTO product_detail 
      (product_name, product_brand, product_image, product_description, product_price, stock, is_refrubished, seller_id, category_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING product_id;
    `;
    const product_result = await db.query(product_detail_sql, product_detail);
    const product_id = product_result.rows[0].product_id;

    const highlightsJSON = {
      highlits: highlights
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line),
    };

    console.log("general_spec: ", general_spec);
    const product_specification = [highlightsJSON, general_spec, product_id];
    const product_spec_sql = `
      INSERT INTO product_specification (highlits, general_spec, product_id)
      VALUES ($1,$2,$3);
    `;
    await db.query(product_spec_sql, product_specification);

    // Insert discount
    const discount = [
      product_id,
      discount_start_date,
      discount_end_date,
      is_active,
    ];
    const discount_sql = `
      INSERT INTO discount (product_id, start_date, end_date, is_active)
      VALUES ($1,$2,$3,$4) RETURNING id;
    `;
    const discount_result = await db.query(discount_sql, discount);
    const discount_id = discount_result.rows[0].id;

    // Insert discount detail
    const discount_detail = [
      coupon_code,
      discount_description,
      discount_type,
      discount_price,
      min_purchase,
      usage_limit,
      discount_id,
    ];
    const discount_detail_sql = `
      INSERT INTO discount_detail 
      (coupon_code, description, discount_type, discount_value, min_purchase_value, usage_limit, discount_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7);
    `;
    await db.query(discount_detail_sql, discount_detail);

    res
      .status(201)
      .json({ message: "Successfully created product", success: "true" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while creating product",
      error: err.message,
    });
  }
};

const singleProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    const sql = singleProductSQL;

    const result = await db.query(sql, [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error occurred while fetching single product",
      error: err.message,
    });
  }
};

module.exports = {
  getAllProduct,
  getProductCategory,
  addNewProduct,
  singleProduct,
};
