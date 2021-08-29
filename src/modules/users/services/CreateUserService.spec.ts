import 'reflect-metadata';
import CreateUsersService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUsersService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new appointment', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with the same email as another user', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoeex@hotmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
