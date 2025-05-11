const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NetProtect Protect API Documentation',
      version: '1.0.0',
      description: 'API documentation for NetProtect Web application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1/',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;