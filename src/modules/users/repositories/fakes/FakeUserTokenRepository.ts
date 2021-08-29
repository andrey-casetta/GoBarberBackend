import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { uuid } from 'uuidv4';
import IUserTokenRepository from '../IUserTokenRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class FakeUserTokenRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken> {
    const userToken = await this.userTokens.find(findToken => findToken.token === token); 

    return userToken || undefined;
  }
}

export default FakeUserTokenRepository;
