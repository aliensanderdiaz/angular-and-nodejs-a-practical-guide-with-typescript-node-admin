import { randomInt } from "crypto";
import { createConnection, getManager } from "typeorm";
import { OrderItem } from "../entity/order-item.entity";
import { Order } from "../entity/order.entity";

createConnection().then(async connection => {
    const orderRepository = getManager().getRepository(Order);
    const orderItemRepository = getManager().getRepository(OrderItem);

    for (let i = 0; i < 30; i++) {

        let day = randomInt(1,28)
        let month = randomInt(1,11)
        let year = randomInt(1999,2021)

        let date = new Date(year, month, day).toDateString()
        const order = await orderRepository.save({
            first_name: `name ${ i + 1 }`,
            last_name: `lastname ${ i + 1 }`,
            email: `email${ i + 1 }@test.com`,
            created_at: date
        })
        

        for (let j = 0; j < randomInt(1, 5); j++) {
            await orderItemRepository.save({
                order,
                product_title: `product ${ i + 1 }`,
                quantity: randomInt(1, 5),
                price: i * 1000
            })
            
        }

        console.log({ i })
    }

    process.exit(0)
})