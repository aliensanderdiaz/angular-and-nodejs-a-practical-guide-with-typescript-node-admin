import { createConnection, getManager } from "typeorm";
import { Product } from "../entity/product.entity";

createConnection().then(async connection => {
    const productRepository = getManager().getRepository(Product);

    for (let i = 0; i < 30; i++) {
        await productRepository.save({
            "title": "product " + (i + 1),
            "description": "description" + (i + 1),
            "image": "https://cdn.corporatefinanceinstitute.com/assets/products-and-services-1024x1024.jpeg",
            "price": (i + 1) * 1000
        })
        console.log({ i })
    }

    process.exit(0)
})