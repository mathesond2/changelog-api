import * as user from '../user';

describe('user handler', () => {
  //TODO: create a local db to test against, and after every test, clear the db..you can do this in a jest config file as well.
  it('should create a new user', async () => {
    const req = {
      body: {
        username: 'my name',
        password: 'admin',
      },
    };

    const res = {
      json({ token }) {
        expect(token).toBeTruthy();
      },
    };

    await user.createNewUser(req, res, () => {});
  });
});
