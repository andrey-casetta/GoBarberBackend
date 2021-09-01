import 'reflect-metadata';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProvidersDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProvidersDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 31, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 31, 10, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2021, 7, 31, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 7, 31, 11).getTime();
    });

    const availability = await listProvidersDayAvailability.execute({
      provider_id: 'user',
      day: 31,
      month: 8,
      year: 2021,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 14, available: true },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ])
    );
  });
});
