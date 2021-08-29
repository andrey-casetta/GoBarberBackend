import 'reflect-metadata';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  });
  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments in the same time', async () => {
    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
