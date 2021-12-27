import { model, Schema } from 'mongoose';

const productSchema: Schema = new Schema({
    title:{
        type:String,
    },
    image: {
        type:String,
        default: "none"
    },
    likes: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

const productModel = model("Product", productSchema)
export default productModel;