
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UserRepository";
import * as yup from "yup";
import { AppError } from "../Errors/AppError";

class UserController {

    private schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required()
    });

    async create(request: Request, response: Response) {
        const { name, email } = request.body;


        try {
            await this.schema.validate(request.body)
        } catch (err) {
            throw new AppError(err);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        if (userAlreadyExists) {
            throw new AppError("User already exists!");
        }

        const user = usersRepository.create({
            name,
            email
        })

        await usersRepository.save(user);

        return response.status(201).json(user);
    }


}

export { UserController };
