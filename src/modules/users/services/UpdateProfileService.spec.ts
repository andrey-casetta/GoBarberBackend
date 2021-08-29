import 'reflect-metadata';

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import UpdateProfileService from './UpdateProfileService';

import AppError from '@shared/errors/AppError';
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@hotmail.com',
    });

    expect(updatedUser.name).toBe('John Tre');
    expect(updatedUser.email).toBe('johntre@hotmail.com');
  });

  it('should not be able to change the email to a already in use email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test Doe',
      email: 'test@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johndoeex@hotmail.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@hotmail.com',
      password: '123123',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without providing old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johntre@hotmail.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoeex@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johntre@hotmail.com',
        password: '123123',
        old_password: 'wrong old password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile of non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing user id',
        name: 'Test',
        email: 'test@example.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
