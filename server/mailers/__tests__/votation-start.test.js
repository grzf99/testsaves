const { addDays } = require('date-fns');
const { Save } = require('../../models');
const VotationStartMailer = require('../votation-start');

beforeEach(() => Save.sync({ force: true }));
afterEach(() => Save.sync({ force: true }));

jest.mock('../../delayed-jobs');
const queue = require('../../delayed-jobs');

describe('#verify', () => {
  describe('when there are no saves on votation', () => {
    it('should not enqueue any jobs', () =>
      VotationStartMailer.verify().then(() => {
        expect(queue.create).not.toHaveBeenCalled();
      }));
  });

  describe('when there are saves on votation', () => {
    it('should enqueue that many jobs', () =>
      Save.bulkCreate([
        {
          date_start: addDays(new Date(), -3),
          date_end: addDays(new Date(), -2)
        },
        {
          date_start: addDays(new Date(), -3),
          date_end: addDays(new Date(), -2)
        }
      ])
        .then(() => VotationStartMailer.verify())
        .then(() => {
          expect(queue.create).toHaveBeenCalledTimes(2);
        }));
  });
});