import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

import AppError from '@shared/errors/AppError';
let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntreex@hotmail.com',
      password: '1234567',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Logged',
      email: 'johnlogged@hotmail.com',
      password: '123456',
    });

    const profile = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(profile).toStrictEqual([user1, user2]);
  });
});
