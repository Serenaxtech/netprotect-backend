/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const roleMiddleware = require('../middelwares/roleMiddelware');
const authMiddleware = require('../middelwares/authMiddleware');

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Welcome endpoint
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/', function (req, res, next) {
  res.json({ message: "Welcome To Users" });
});

/**
 * @swagger
 * /user/integrator:
 *   post:
 *     summary: Create a new integrator user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstname
 *               - lastname
 *               - email
 *               - phone_number
 *               - organizations
 *               - password
 *               - confirm_password
 *             properties:
 *               username:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *               organizations:
 *                 type: array
 *                 items:
 *                   type: string
 *               password:
 *                 type: string
 *                 format: password
 *               confirm_password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Integrator user created successfully
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: ['All fields are required', 'Passwords do not match', 'Email already taken', 'Phone Number already taken', 'Username already taken']
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires root role
 *       500:
 *         description: Internal server error
 */
router.post('/integrator', authMiddleware, roleMiddleware('root'), userController.createIntegratorUser);

/**
 * @swagger
 * /user/admin:
 *   post:
 *     summary: Create a new admin user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstname
 *               - lastname
 *               - email
 *               - phone_number
 *               - organizations
 *               - password
 *               - confirm_password
 *             properties:
 *               username:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *               organizations:
 *                 type: array
 *                 items:
 *                   type: string
 *               password:
 *                 type: string
 *                 format: password
 *               confirm_password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: ['All fields are required', 'Passwords do not match', 'Email already taken', 'Phone Number already taken', 'Username already taken']
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires root role
 *       500:
 *         description: Internal server error
 */
router.post('/admin', authMiddleware, roleMiddleware('root'), userController.createAdminUser);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new normal user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstname
 *               - lastname
 *               - email
 *               - phone_number
 *               - organizations
 *               - password
 *               - confirm_password
 *             properties:
 *               username:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *               organizations:
 *                 type: array
 *                 items:
 *                   type: string
 *               password:
 *                 type: string
 *                 format: password
 *               confirm_password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Normal user created successfully
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: ['All fields are required', 'Passwords do not match', 'Email already taken', 'Phone Number already taken', 'Username already taken']
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires root, integrator or admin role
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, roleMiddleware('root', 'integrator', 'admin'), userController.createNormalUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: HTTP-only cookie containing JWT token
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/logout', authMiddleware, authController.logout);

module.exports = router;