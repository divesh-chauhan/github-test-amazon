const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
       productId:{
            type:Schema.Types.ObjectId,
            ref:'Product',
            required:true
       },
       quantity:{
            type:Number,
            required:true
       },
       subTotal:{
            type:Number,
            required:true
       }
    }],
    subtotal:{
        type:Number,
        required:true
    },
    tax:{
        type:Number,
        required:true
    },
    shipping:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    }
},{timestamps:true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;