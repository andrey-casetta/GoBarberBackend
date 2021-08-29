import 'reflect-metadata';
import AuthenticateUsersService from './AuthenticateUserService';
import CreateUsersService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUsersService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUsersService(fakeUsersRepository, fakeHashProvider);

    authenticateUser = new AuthenticateUsersService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });
  it('should be able to authenticate', async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUsersService(fakeUsersRepository, fakeHashProvider);

    authenticateUser = new AuthenticateUsersService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });

  it('should be not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoeex@hotmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not be able to authenticate with wrong email/password combination', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoeex@hotmail.com',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
