import 'reflect-metadata';

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import ShowProfileService from './ShowProfileService';

import AppError from '@shared/errors/AppError';
let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoeex@hotmail.com');
  });

  it('should not be able to show the profile of non-existing user', async () => {
    expect(
      showProfile.execute({
        user_id: 'non-existing user id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
