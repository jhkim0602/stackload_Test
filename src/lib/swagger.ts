
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StackLoad API',
      version: '1.0.0',
      description: 'API documentation for the StackLoad project',
    },
    // components: {
    //   securitySchemes: {
    //     bearerAuth: {
    //       type: 'http',
    //       scheme: 'bearer',
    //       bearerFormat: 'JWT',
    //     },
    //   },
    // },
    // security: [
    //   {
    //     bearerAuth: [],
    //   },
    // ],
  },
  apis: ['./src/app/api-docs/definitions.ts', './src/app/api/**/*.ts'], // files containing annotations as above
};

export const openapiSpecification = swaggerJsdoc(options);
