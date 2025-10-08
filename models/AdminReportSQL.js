const graphDataSQL = `
      WITH week_days AS (
        SELECT generate_series(
          date_trunc('week', current_date),
          date_trunc('week', current_date) + interval '6 days',
          interval '1 day'
        )::date AS day
      ),
      revenue AS (
        SELECT 
          DATE(po.ordered_at) AS day,
          SUM(oi.item_price * oi.quantity) AS total_revenue,
          CASE 
            WHEN DATE_TRUNC('week', po.ordered_at) = DATE_TRUNC('week', CURRENT_DATE)
              THEN 'current_week'
            WHEN DATE_TRUNC('week', po.ordered_at) = DATE_TRUNC('week', CURRENT_DATE - interval '1 week')
              THEN 'previous_week'
          END AS week_type
        FROM product_order po
        JOIN order_items oi ON po.order_id = oi.order_id
        WHERE DATE_TRUNC('week', po.ordered_at) IN (
          DATE_TRUNC('week', CURRENT_DATE),
          DATE_TRUNC('week', CURRENT_DATE - interval '1 week')
        )
        GROUP BY week_type, DATE(po.ordered_at)
      )
      SELECT 
        TO_CHAR(w.day, 'Dy') AS day_name,
        COALESCE(SUM(CASE WHEN r.week_type = 'previous_week' AND r.day = w.day - interval '7 days' THEN r.total_revenue END), 0) AS previous_week,
        COALESCE(SUM(CASE WHEN r.week_type = 'current_week' AND r.day = w.day AND w.day <= CURRENT_DATE THEN r.total_revenue END), 0) AS current_week
      FROM week_days w
      LEFT JOIN revenue r 
        ON (r.day = w.day OR r.day = w.day - interval '7 days')
      GROUP BY w.day
      ORDER BY w.day;
    `;
const piechartSQL = `
          SELECT 
            pd.product_name,
            SUM(oi.quantity) AS sales
          FROM order_items oi
          JOIN product_detail pd ON pd.product_id = oi.product_id
          GROUP BY pd.product_id, pd.product_name
          ORDER BY sales DESC
          LIMIT 5;
  `;
const getDashbordReportSQL = `
        SELECT
          -- Revenue
          SUM(oi.item_price * oi.quantity) FILTER (
              WHERE DATE_TRUNC('month', po.ordered_at) = DATE_TRUNC('month', CURRENT_DATE)
          ) AS current_month_revenue,
          
          SUM(oi.item_price * oi.quantity) FILTER (
              WHERE DATE_TRUNC('month', po.ordered_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          ) AS last_month_revenue,
  
          -- Orders
          COUNT(DISTINCT po.order_id) FILTER (
              WHERE DATE_TRUNC('month', po.ordered_at) = DATE_TRUNC('month', CURRENT_DATE)
          ) AS current_orders,
  
          COUNT(DISTINCT po.order_id) FILTER (
              WHERE DATE_TRUNC('month', po.ordered_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          ) AS last_orders,
  
          -- Customers
          COUNT(DISTINCT co.user_id) FILTER (
              WHERE DATE_TRUNC('month', co.createat) = DATE_TRUNC('month', CURRENT_DATE)
          ) AS new_customers,
  
          COUNT(DISTINCT co.user_id) FILTER (
              WHERE DATE_TRUNC('month', co.createat) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          ) AS old_customers
        FROM order_items oi
        JOIN product_order po ON oi.order_id = po.order_id
        JOIN user_detail co ON co.user_id = po.user_id;
      `;
module.exports = { graphDataSQL, piechartSQL, getDashbordReportSQL };
