import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { injectable, inject } from 'tsyringe';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
    password: string;
    token: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository
    ) { }

    public async execute({ password, token }: IRequest): Promise<void> {
        const userToken = await this.userTokenRepository.findByToken(token);

        if (!userToken)
            throw new AppError('User token not found');

        const user = await this.usersRepository.findById(userToken.user_id);

        if (!user)
            throw new AppError('User does not exist!')

        user.password = password;

        this.usersRepository.save(user);


    }
}

export default ResetPasswordService;
