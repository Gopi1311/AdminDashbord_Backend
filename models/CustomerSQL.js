const getAllCustomerDetailSQL = `
        SELECT
            co.user_id AS id,
            co.first_name,
            co.last_name,
            co.email,
            co.phone_number ,
            co.role as role,
            co.status AS status,
            cl.address AS address,
            COUNT(po.order_id) AS orders,
            COALESCE(SUM(oi.item_price * oi.quantity), 0) AS totalSpent,
            MAX(po.ordered_at) AS lastOrder
        FROM user_detail co
        LEFT JOIN user_location cl ON co.user_id = cl.user_id
        LEFT JOIN product_order po ON co.user_id = po.user_id
        LEFT JOIN order_items oi ON po.order_id = oi.order_id
        WHERE co.role  != 'admin'
        GROUP BY co.user_id, co.first_name, co.last_name, co.email, co.phone_number, co.role, cl.address
        ORDER BY lastOrder DESC NULLS LAST;
    `;
const customerDetailSQL = `
          SELECT 
            co.user_id,
            co.first_name,
            co.last_name,
            co.email,
            co.phone_number phone,
            co.role,
            co.createat,
            co.status,
            cl.address,
            cl.pincode,
            cl.address_type,
            COUNT(po.order_id) AS totalOrders,
            COALESCE(SUM(oi.item_price * oi.quantity), 0) AS totalSpent,
            MAX(po.ordered_at) AS lastOrder,
            COUNT(*) FILTER (WHERE po.order_status = 'shipped')   AS shippedOrders,
            COUNT(*) FILTER (WHERE po.order_status = 'delivered') AS deliveredOrders,
            COUNT(*) FILTER (WHERE po.order_status = 'cancelled') AS cancelledOrders,
            COUNT(*) FILTER (WHERE po.order_status = 'confirmed') AS confirmedOrders
          FROM user_detail co
          LEFT JOIN user_location cl ON co.user_id = cl.user_id
          LEFT JOIN product_order po ON co.user_id = po.user_id
          LEFT JOIN order_items oi ON po.order_id = oi.order_id
          WHERE co.user_id = $1
          GROUP BY co.user_id, co.first_name, co.last_name, co.email, 
            co.phone_number, co.role, co.status, cl.address,
            cl.pincode,cl.address_type
        `;

module.exports = { getAllCustomerDetailSQL, customerDetailSQL };
