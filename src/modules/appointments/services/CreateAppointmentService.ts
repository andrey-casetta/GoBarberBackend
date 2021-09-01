import { isAfter, isBefore, startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';
import getHours from 'date-fns/getHours';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentParsedDate = startOfHour(date);

    if (isBefore(appointmentParsedDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date");
    }

    if (
      getHours(appointmentParsedDate) < 8 ||
      getHours(appointmentParsedDate) > 17
    ) {
      throw new AppError(
        'You can only create an appointment between 8am and 17pm'
      );
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself'");
    }

    const findAppointmentInSameDate =
      await this.appointmentsRepository.findByDate(appointmentParsedDate);

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked!');
    }
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentParsedDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
