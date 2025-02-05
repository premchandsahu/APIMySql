const express = require('express');
const {centerRoutes,invoiceRoutes,purchaseRoutes,productRoutes,productcategoryRoutes,customerRoutes,supplierRoutes,supplierpaymentRoutes,customerreceiptRoutes,userRoutes,paymentmodeRoutes} = require('./router');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT ||3000;



//const orderItemsRoutes = require('./routes/orderItems');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/invoice', invoiceRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/product', productRoutes);
app.use('/customer', customerRoutes);
app.use('/supplier', supplierRoutes);
app.use('/customerreceipt', customerreceiptRoutes);
app.use('/supplierpayment', supplierpaymentRoutes);
app.use('/productcategory', productcategoryRoutes);
app.use('/center', centerRoutes);
app.use('/user', userRoutes);
app.use('/paymentmode', paymentmodeRoutes);
app.get("/test", (req, res) => {
    res.send("Test route is working!");
});
//app.use('/order-items', orderItemsRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});