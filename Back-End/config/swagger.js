import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'A simple swagger documentation setup',   
    },
    servers: [
      {
        url:'https://quick-serve.onrender.com'
      },
    ],
    schemes: ['http', 'https']  
  },
  apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}


