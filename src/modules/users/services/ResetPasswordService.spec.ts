import 'reflect-metadata';
// import CreateUsersService from './CreateUserService';
// import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokenRepository,
            fakeHashProvider
        );
    });

    it('should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoeex@hotmail.com',
            password: '123456',
        });

        const userToken = await fakeUserTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({
            password: '123123',
            token: userToken.token
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with non existing token', async () => {
        await expect(resetPassword.execute({
            token: 'non existing token',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non existing user', async () => {
        const { token } = await fakeUserTokenRepository.generate('non existing user');

        expect(resetPassword.execute({
            token,
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            password: '123456',
            email: 'johndoeex@hotmail.com'
        })

        const { token } = await fakeUserTokenRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        })

        await expect(resetPassword.execute({
            token,
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });
});
