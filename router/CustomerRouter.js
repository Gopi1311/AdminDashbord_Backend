const express = require("express");
const router = express.Router();
const {
  getAllCustomerDetails,
  addNewCustomer,
  customerDetail,
  updateCustomerStatus,
} = require("../controller/CustomerController");

router.get("/allcustomer", getAllCustomerDetails);
router.post("/addcustomer", addNewCustomer);
router.get("/customerdetail", customerDetail);
router.put("/customerstatus/:userId", updateCustomerStatus);

module.exports = router;
