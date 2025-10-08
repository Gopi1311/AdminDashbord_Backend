const express = require("express");
const router = express.Router();
const {
  getDashBoardReport,
  getAdminDetail,
  graphData,
  pieChart,
} = require("../controller/AdminReportController");

router.get("/statusreport", getDashBoardReport);
router.get("/admin", getAdminDetail);
router.get("/graph", graphData);
router.get("/piechart", pieChart);

module.exports = router;
