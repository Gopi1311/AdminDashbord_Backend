const express = require("express");
const cors = require("cors");
const ProductRouter = require("./router/ProductRouter");
const OrderedRouter = require("./router/OrderedRouter");
const CustomerRouter = require("./router/CustomerRouter");
const Dashstatus = require("./router/AdminReportRouter");
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://admindashbord03.netlify.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);

    // Only allow requests from allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // allow cookies or auth headers
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.use("/api", ProductRouter);
app.use("/api", OrderedRouter);
app.use("/api", CustomerRouter);
app.use("/api", Dashstatus);
app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from backend!",
    instance: process.env.INSTANCE_NAME || "default-instance",
  });
});


app.listen(PORT, () => {
  console.log(`Server Listening in :${PORT}`);
});
