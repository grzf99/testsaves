const { Save, Product, Vote, Provider } = require('../models');

module.exports = {
  async verify() {
    const saves = await Save.scope('lastChance').findAll({
      include: [{ model: Product, required: true, include: [Vote, Provider] }]
    });
    return saves.map(save =>
      global.queue.create('last-chance', { save }).removeOnComplete(true).save()
    );
  }
};
