const orderTrackingSQL = `
     SELECT 
      po.ordered_at,
      po.delivery_date,
      po.order_status,
      up.payment_status
    FROM product_order po
    LEFT JOIN user_payment up 
        ON po.order_id = up.order_id
    WHERE po.user_id = $1
    ORDER BY po.ordered_at DESC
    LIMIT 1;
    `;
const notifySQL = `
          SELECT 
            ud.first_name,
            ud.last_name,
            up.payment_status
          FROM user_payment up
          JOIN product_order po ON up.order_id = po.order_id
          JOIN user_Detail ud ON po.user_id=ud.user_id
          WHERE up.payment_status = 'success'
          ORDER BY up.created_at DESC
          LIMIT 1;
        `;

module.exports = { orderTrackingSQL, notifySQL };
