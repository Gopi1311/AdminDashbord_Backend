const express = require("express");
const cors = require("cors");
const ProductRouter = require("./router/ProductRouter");
const OrderedRouter = require("./router/OrderedRouter");
const CustomerRouter = require("./router/CustomerRouter");
const Dashstatus = require("./router/AdminReportRouter");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://admindashbord03.netlify.app",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials:true,
  })
);

const PORT = process.env.PORT || 5000;

app.use("/api", ProductRouter);
app.use("/api", OrderedRouter);
app.use("/api", CustomerRouter);
app.use("/api", Dashstatus);

app.listen(PORT, () => {
  console.log(`Server Listening in :${PORT}`);
});
