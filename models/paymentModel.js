const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderId:{
        type:Schema.Types.ObjectId,
        ref:'Order',
        required:true
    },
    paidAmount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:['Cash', 'Credit Card', 'PayPal', 'Stripe', 'Bank Transaction'],
        required:true
    },
    transactionId:{
        type:String,
    },
    status:{
        type:String,
        enum:['Pending', 'Completed', 'Canceled'],
        required:true
    }
},{timestamps:true});

const Payment = mongoose.model('Payment', paymentSchema);


module.exports = Payment;