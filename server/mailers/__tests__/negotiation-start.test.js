const { addDays, startOfDay, endOfDay } = require('date-fns');
const { Save, Product, Provider } = require('../../models');
const NegotiationStartMailer = require('../negotiation-start');

beforeEach(() =>
  Save.sync({ force: true });
);
afterEach(() =>
  Save.sync({ force: true });
);

jest.mock('../../delayed-jobs');
global.queue = require('../../delayed-jobs');

describe('#verify', () => {
  describe('when there are no saves on votation', () => {
    it('should not enqueue any jobs', () =>
      VotationStartMailer.verify().then(() => {
        expect(global.queue.create).not.toHaveBeenCalled();
      }));
  });

  describe('when there are saves on votation', () => {
    it('should enqueue that many jobs', () =>
      Save.bulkCreate([
        {
          date_start: addDays(startOfDay(new Date()), -3),
          date_end: addDays(endOfDay(new Date()), -2)
        },
        {
          date_start: addDays(startOfDay(new Date()), -3),
          date_end: addDays(endOfDay(new Date()), -2)
        }
      ])
        .then(() => VotationStartMailer.verify())
        .then(() => {
          expect(global.queue.create).toHaveBeenCalledTimes(2);
        }));
  });
});