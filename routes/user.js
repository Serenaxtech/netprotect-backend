const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roleMiddleware = require('../middelwares/roleMiddelware');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: "Welcome To Users" });
});

router.post('/integrator', /*roleMiddleware,*/ userController.createIntegratorUser);
router.post('/admin', /*roleMiddleware,*/ userController.createAdminUser);
router.post('/', /*roleMiddleware,*/ userController.createNormalUser);

module.exports = router;