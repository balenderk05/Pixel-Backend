import connectDatabase from "../config/database.js";
import productRepository from "../modules/product/product.repository.js";

const createPixelProduct = async () => {
    try {
        await connectDatabase()
        const product = await productRepository.createProduct({
            name: "Pixel",
            slug: "pixell",
            unit: "meter",
            pricePerUnit:500,
            minQuantity: 1,
            maxQuantity:10000,
            isActive: true
        })

        console.log("Product Created");
        console.log(product)
    } catch (error) {
         console.error("Failed to create product:");
        console.error(error);

        process.exit(1);
    }
}

createPixelProduct();