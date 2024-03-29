import MockResponse from 'mock-express-response';
import { User } from '../../models';
import authController from '../auth';

jest.mock('../../mailers/forgot-password');

beforeEach(() => {
  require('dotenv').config();
  return User.sync({ force: true });
});

afterEach(() => User.sync({ force: true }));

describe('clientLogin', () => {
  const req = {
    body: {
      email: 'jonsnow@winterfell.com',
      password: '123456'
    }
  };

  describe('when user exists', () => {
    describe('when password is correct', () => {
      it('should return 200 and a user object', () => {
        const res = new MockResponse();
        return User.create(Object.assign({}, req.body))
          .then(() => authController.clientLogin(req, res))
          .then(() => {
            expect(res.statusCode).toEqual(200);
            expect(res._getJSON()).toEqual(
              expect.objectContaining({
                email: expect.any(String),
                admin: expect.any(Boolean),
                token: expect.any(String),
                Profile: null
              })
            );
          });
      });
    });

    describe('when password is incorrect', () => {
      it('should return 422', () => {
        const res = new MockResponse();

        return User.create(Object.assign({}, req.body))
          .then(() => {
            req.body.password = 'anyOtherPassword';
            return authController.clientLogin(req, res);
          })
          .then(() => {
            expect(res.statusCode).toEqual(422);
          });
      });
    });
  });

  describe('when user does not exist', () => {
    it('should return 422', () => {
      const res = new MockResponse();
      return authController.clientLogin(req, res).then(() => {
        expect(res.statusCode).toEqual(422);
      });
    });
  });
});
