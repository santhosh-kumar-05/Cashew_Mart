const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const router = require("./routes/productroute");
const authroute =require('./routes/authroute')
const cartroutes=require('./routes/cartRoutes')
const razorpay=require('./routes/RzorpayRoute')
const order =require('./routes/orderRoute')
const message = require('./routes/messageRoutes')

dotenv.config();

const app = express();
app.use(express.urlencoded({extended:true}))

app.use(cors());
app.use(express.json());
app.use("/admin", adminRoutes);
app.use(router);
app.use('/api/auth',authroute)
app.use("/api/cart",cartroutes)
app.use(razorpay)
app.use(order)
app.use(message)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
