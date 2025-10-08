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
    'https://admindashbord03.netlify.app/',
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true); 
        }
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.use("/api", ProductRouter);
app.use("/api", OrderedRouter);
app.use("/api", CustomerRouter);
app.use("/api", Dashstatus);

app.listen(PORT, () => {
  console.log(`Server Listening in :${PORT}`);
});
