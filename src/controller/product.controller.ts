import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Product } from "../entity/product.entity";

export const Products = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Product);

    const take = 15;
    const page = +req.query.page || 1;

    const [data, total] = await repository.findAndCount({
        take,
        skip: (page - 1) * take
    })

    res.send({meta: {total, page, last_page: Math.ceil(total / take)}, products: data})
}

export const CreateProduct = async (req: Request, res: Response) => {
    const body = req.body

    const repository = getManager().getRepository(Product)

    const product =  await repository.save(body)

    res.status(201).send(product)
}

export const GetProduct = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Product)

    const product = await repository.findOne(+req.params.id)

    res.status(202).send(product)
}

export const UpdateProduct = async (req: Request, res: Response) => {
    const body = req.body
    const repository = getManager().getRepository(Product)

    const product = await repository.update(+req.params.id, body)

    res.send(product)
}

export const DeleteProduct = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Product)

    await repository.delete(+req.params.id)

    res.status(204).send(null)
}