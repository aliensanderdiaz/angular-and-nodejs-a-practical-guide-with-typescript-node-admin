import { Request, Response } from "express";
import { getManager } from "typeorm";
import bcryptjs from "bcryptjs";
import { User } from "../entity/user.entity";
import { RegisterValidation } from "../validation/register.validation";
import { sign, verify } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = RegisterValidation.validate(body)

  if (body.password !== body.password_confirm) {
    return res.status(400).send({
      message: 'Password\'s do not match'
    })
  }

  if (error) {
    return res.status(400).send(error.details)
  }

  const repository = getManager().getRepository(User);

  const { password, ...user } = await repository.save({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: await bcryptjs.hash(body.password, 10),
  })

  res.send(user);

}

export const Login = async (req: Request, res: Response) => {

  const repository = getManager().getRepository(User);

  const user = await repository.findOne({ email: req.body.email })

  if (!user) {
    return res.status(404).send({
      message: 'Invalid credentials'
    })
  }

  if (!await bcryptjs.compare(req.body.password, user.password)) {
    return res.status(400).send({
      message: 'Invalid credentials'
    })
  }

  const token = sign({ id: user.id }, process.env.SECRET_KEY)

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  })

  res.send({
    message: 'Success'
  })
}

export const AuthenticatedUser = async (req: Request, res: Response) => {

  res.send(req['user'])
}

export const Logout = async (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    maxAge: 0
  })

  res.send({
    message: 'Success'
  })
}

export const UpdateInfo = async (req: Request, res: Response) => {
  const user = req['user']

  const repository = getManager().getRepository(User);

  await repository.update(user.id, req.body)

  const { password, ...data } = await repository.findOne(user.id)

  res.send(data)
}

export const UpdatePassword = async (req: Request, res: Response) => {
  const user = req['user']
  const body = req.body

  if (body.password !== body.password_confirm) {
    return res.status(400).send({
      message: 'Password\'s do not match'
    })
  }

  const repository = getManager().getRepository(User);

  await repository.update(user.id, {
    password: await bcryptjs.hash(body.password, 10)
  })

  res.send(user)
}