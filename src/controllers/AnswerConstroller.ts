import { Request, Response } from 'express'; 
import { getCustomRepository } from 'typeorm';
import { AppError } from '../Errors/AppError';
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {

    async execute(request: Request, response: Response){
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        if(!surveyUser){
            throw new AppError("Survey User does not exits");
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }

}

export { AnswerController }