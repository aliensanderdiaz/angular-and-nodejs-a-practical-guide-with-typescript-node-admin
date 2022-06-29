import { Request, Response } from "express";
import { Parser } from "json2csv";
import { getManager } from "typeorm";
import { OrderItem } from "../entity/order-item.entity";
import { Order } from "../entity/order.entity";

export const Orders = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Order);

    const take = 15;
    const page = +req.query.page || 1;

    const [data, total] = await repository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations: ['order_items']
    })

    const dataBetter = data.map(order => ({
        id: order.id,
        name: order.name,
        email: order.email,
        created_at: order.created_at,
        total: order.total,
        order_items: order.order_items,
    }))

    res.send({meta: {total, page, last_page: Math.ceil(total / take)}, orders: dataBetter})
}

export const Export = async (req: Request, res: Response) => {
    const parser = new Parser({
        fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity']
    })

    const repository = getManager().getRepository(Order);

    const orders = await repository.find({
        relations: ['order_items']
    })

    const json = []

    orders.forEach((order: Order) => {
        json.push({
            ID: order.id,
            Name: order.name,
            Email: order.email,
            'Product Title': '',
            Price: '',
            Quantity: ''
        })

        order.order_items.forEach((item: OrderItem) => {
            json.push({
                ID: '',
                Name: '',
                Email: '',
                'Product Title': item.product_title,
                Price: item.price,
                Quantity: item.quantity
            })
        })
    })

    const csv = parser.parse(json)

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv)
}

export const Chart = async (req: Request, res: Response) => {

    const manager  = getManager();

    const result = await manager.query(`
        SELECT date_format(o.created_at, '%Y-%m-%d') as date, SUM(oi.price * oi.quantity) as sum FROM node_admin.order o JOIN order_item oi on o.id = oi.order_id group by date;
    `)

    res.send(result)

}