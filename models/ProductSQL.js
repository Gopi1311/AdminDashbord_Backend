const singleProductSQL = `
      SELECT
        po.product_id AS id,
        po.product_name AS product_name,
        po.product_price AS price,
        po.product_brand AS brand,
        po.product_description AS description,
        po.is_refrubished AS is_refurbished,
        po.stock AS stock_quantity,
        po.product_image AS product_image,
        ps.highlits,
        ps.general_spec,
        ct.category_name,
        d.start_date,
        d.end_date,
        d.is_active,
        dd.coupon_code,
        dd.description as discount_desc,
        dd.discount_type,
        dd.discount_value,
        dd.min_purchase_value as min_purchase,
        dd.usage_limit as limit
      FROM product_detail po
      JOIN product_specification ps ON po.product_id = ps.product_id
      JOIN category ct ON po.category_id = ct.id
      LEFT JOIN discount d ON po.product_id= d.product_id
      JOIN discount_detail dd ON d.id=dd.discount_id
      WHERE po.product_id = $1;
    `;
const getallProductSQL = `
        SELECT
          pd.product_id as id,
          pd.product_name as name,
          pd.product_image as image,
          ct.category_name as category,
          pd.product_price as price,
          pd.stock as stock,
          pd.stock as status
        FROM product_detail pd
        JOIN category ct ON pd.category_id=ct.id
        ORDER BY pd.post_date desc;
    `;
module.exports = { singleProductSQL, getallProductSQL };
