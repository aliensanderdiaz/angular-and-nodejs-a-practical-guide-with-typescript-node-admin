import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";

export const Users = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User);

    const take = 15;
    const page = +req.query.page || 1;

    const [users, total] = await repository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations: ['role']
    })

    const usersNoPassword = users.map((user: any) => {
        const { password, ...data } = user;
        return data
    })

    res.send({meta: {total, page, last_page: Math.ceil(total / take)}, users: usersNoPassword})
}

export const CreateUser = async (req: Request, res: Response) => {
    const { role_id, ...body } = req.body
    const hashedPassword = await bcryptjs.hash('1234', 10)

    const repository = getManager().getRepository(User)

    const { password, ...user } = await repository.save({
        ...body,
        password: hashedPassword,
        role: {
            id: role_id
        }
    })

    res.status(201).send(user)
}

export const GetUser = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User)

    const user = await repository.findOne(+req.params.id, {
        relations: ['role']
    })

    const { password, ...data } = user

    res.status(202).send(data)
}

export const UpdateUser = async (req: Request, res: Response) => {
    const { role_id, ...body } = req.body
    const repository = getManager().getRepository(User)

    const user = await repository.update(+req.params.id, {
        ...body,
        role: {
            id: role_id
        }
    })

    const { password, ...data } = await repository.findOne(req.params.id, {
        relations: ['role']
    })

    res.send(data)
}

export const DeleteUser = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User)

    await repository.delete(+req.params.id)

    res.status(204).send(null)
}