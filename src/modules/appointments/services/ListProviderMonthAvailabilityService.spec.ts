import 'reflect-metadata';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProvidersMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProvidersMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentRepository
    );
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 9, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 10, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 11, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 12, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 13, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 14, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 15, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 16, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 29, 17, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 30, 17, 0, 0),
    });

    const availability = await listProvidersMonthAvailability.execute({
      provider_id: 'user',
      month: 8,
      year: 2021,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 28, available: true },
        { day: 29, available: false },
        { day: 30, available: true },
        { day: 31, available: true },
      ])
    );
  });
});
