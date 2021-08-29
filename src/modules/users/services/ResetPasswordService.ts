import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import { isAfter, addHours } from 'date-fns';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
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
    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('HashProvider') private hashProvider: IHashProvider
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) throw new AppError('User token not found');

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('User does not exist!');

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
