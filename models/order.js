import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    cart:{
        type: Array,
        required: true,
    },
    shippingAddress:{
        type: Object,
        required: true,
    },
    user:{
        type: Object,
        required: true,
    },
    totalPrice:{
        type: Number,
        required: true,
    },
    shippingFee:{
        type: Number,
        require: true,
    },
    discountPrice:{
        type: Number,
        default: 0,
    },
    status:{
        type: String,
        default: "WAITING PAYMENT",
    },
    paymentInfo:{
        id:{
            type: String,
        },
        status: {
            type: String,
        },
        type:{
            type: String,
        },
        paidAt:{
            type: Date,
        },
    },
    deliveredAt: {
        type: Date,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Order", orderSchema);