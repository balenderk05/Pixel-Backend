import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true,
            trim:true
        },
        slug: {
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        unit: {
            type: String,
            required: true,
            enum:["meter"],
        },
        pricePerUnit: {
            type: Number,
            required:true,
            min: 0
        },
        minQuantity: {
            type: Number,
            required:true,
            min:1,
            default: 1
        },
        maxQuantity: {
            type: Number,
            required:true,
            min:1
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps:true
    }
)

const Product = mongoose.model("Prodcut", productSchema);

export default Product;