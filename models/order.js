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
    status:{
        type: String,
        default: "PROCESSING",
    },
    paymentLink:{
        type: String,
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