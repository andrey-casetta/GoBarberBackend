import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailability from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { provider_id } = req.params;
    const { day, year, month } = req.body;
    const listProvidersDayAvailability = container.resolve(
      ListProviderDayAvailability
    );

    const availability = await listProvidersDayAvailability.execute({
      provider_id,
      month,
      year,
      day,
    });

    return res.json(availability);
  }
}
