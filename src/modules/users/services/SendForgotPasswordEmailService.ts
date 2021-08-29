import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { injectable, inject } from 'tsyringe';
import IUserTokensRepository from '../repositories/IUserTokenRepository';
import path from 'path';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('MailProvider') private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (!checkUserExists) throw new AppError('User doesnt exist!');

    const { token } = await this.userTokensRepository.generate(
      checkUserExists.id
    );

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    );

    await this.mailProvider.sendMail(
      {
        to: {
          name: checkUserExists.name,
          email: checkUserExists.email,
        },
        subject: '[GoBarber] Recuperação de senha',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: checkUserExists.name,
            link: `http://localhost:3000/reset_password?token=${token}`,
          },
        },
      }
      // email,
      // `Pedido de recuperação de senha recebido. ${token}`
    );
  }
}

export default SendForgotPasswordEmailService;
