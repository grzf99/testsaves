const express = require('express');
const { saves, subscriptions, votes } = require('../controllers');
const {
  clientAuthentication,
  adminAuthentication
} = require('../middleware/authentication');

const router = express.Router();


router.get('/active', clientAuthentication(true), saves.listActive);
router.get('/subscribed', clientAuthentication(), saves.listSubscribed);
router.get('/all', adminAuthentication(), saves.listAll);
router.get('/getCoupon/:id', clientAuthentication(), saves.getCoupon);

// client
router.get('/:id', clientAuthentication(true), saves.show);
router.get(
  '/:id/my-subscription',
  clientAuthentication(),
  saves.mySubscription
);
router.post(
  '/:saveId/subscriptions',
  clientAuthentication(),
  subscriptions.create
);
router.get('/:saveId/votes', clientAuthentication(), votes.show);
router.post('/:saveId/votes', clientAuthentication(), votes.create);

// admin
router.get('/:saveId/save', adminAuthentication(), saves.showSave);
router.post('/', adminAuthentication(), saves.create);
router.put('/:id', adminAuthentication(), saves.update);
router.delete('/:id', adminAuthentication(), saves.delete);
router.get(
  '/:saveId/subscriptions',
  adminAuthentication(),
  saves.listSubscriptions
);
router.get(
  '/:saveId/users',
  adminAuthentication(),
  saves.listUsers
);

router.get('/getScope/:scope', adminAuthentication(), saves.getScope);

module.exports = router;
