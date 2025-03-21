const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const roleMiddleware = require('../middelwares/roleMiddelware');
const authMiddleware = require('../middelwares/authMiddleware');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: "Welcome To Users" });
});

router.post('/integrator', authMiddleware, roleMiddleware('root'), userController.createIntegratorUser);
router.post('/admin', authMiddleware, roleMiddleware('root'), userController.createAdminUser);
router.post('/', authMiddleware, roleMiddleware('root', 'integrator', 'admin'), userController.createNormalUser);

router.post('/login', authController.login);
router.get('/logout', authMiddleware, authController.logout);

module.exports = router;