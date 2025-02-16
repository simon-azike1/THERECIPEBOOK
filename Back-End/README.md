# QUICKSERVE: Node.js & Express.js Starter Template

QUICKSERVE is a robust and advanced starter template designed to jump-start your backend application development with Node.js and Express.js. It offers a clean and scalable structure following best practices in Node.js development, perfect for building RESTful APIs and web applications.

## Features
- **Environment Configuration**: Easily configurable environment variables with support for `.env` files.
- **Security**: Helmet for securing HTTP headers and CORS configuration to handle cross-origin requests.
- **Logging**: Integrated Morgan logging for debugging and tracking HTTP requests.
- **Authentication**: JWT token generation and validation with password hashing and email verification.
- **File Uploads**: Cloudinary integration for image storage, and Multer setup for handling file uploads.
- **Email Services**: Setup for sending emails via Nodemailer with support for templated emails (Handlebars).
- **Structured Folder Setup**: Organized directories for routes, models, controllers, middlewares, and utilities to maintain clean, modular code.
- **Swagger Docs**: Built-in Swagger configuration for easy API documentation and testing.
- **Database Connection**: MongoDB integration with Mongoose for seamless database interactions.

## Folder Structure

```
QUICKSERVE/
│l
├── config/
│   ├── swagger.js         # Swagger configuration for API documentation
│
├── controllers/           # Route controllers handling business logic
│
├── middlewares/           # Custom middlewares (e.g., error handler)
│
├── models/                # Mongoose models
│
├── routes/                # API routes
│
├── schema/                # Mongoose schema files
│
├── utils/                 # Helper functions (e.g., token generation, email handler)
│
├── database/              # Database connection setup
│
├── services/              # Public files (e.g., uploads)
│
├── .env                   # Environment variables
├── server.js              # Main entry point for the app
├── package.json           # Project metadata and dependencies
├── README.md              # Project documentation
└── .gitignore             # Git ignore file
```

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) or a cloud MongoDB provider (e.g., MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kobiowuquadri/quicksserve.git
   ```

2. **Install dependencies:**

   Navigate into the project directory and run:

   ```bash
   cd quickserve
   npm install
   ```

3. **Setup environment variables:**

   Create a `.env` file in the root of the project and configure the following environment variables:

   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODEMAILER_MAIL=your_email@example.com
   NODEMAILER_PASSWORD=your_email_password
   FRONTEND_URL=http://localhost:3000
   ```

   Ensure that your email provider supports the Nodemailer service for email functionality.

4. **Start the application:**

   Run the development server:

   ```bash
   npm run dev
   ```

   Your app will be live at `http://localhost:3000` (or another port specified in your `.env` file).

### Available Scripts

- **Start the app in development mode**:  
   `npm run dev`  
   Starts the server with hot reloading enabled for development.

- **Start the app in production mode**:  
   `npm start`  
   Starts the server in production mode.

- **Run tests**:  
   You can add testing libraries (e.g., Jest, Mocha) and run tests as needed.

## API Documentation

API endpoints are documented using Swagger. To view the documentation:
1. Start the app using `npm run dev`
2. Navigate to `http://localhost:3000/api-docs` to view and interact with the API.

## Contributing

Feel free to contribute to this project by submitting pull requests to enhance its functionality. When submitting a PR, please ensure:
- The code is well-documented
- Tests are added for new features
- The code follows the project’s style and guidelines

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Express.js**: Web framework used for building the server.
- **MongoDB & Mongoose**: Database and ORM for storing data.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **Nodemailer**: For email functionality.
- **Cloudinary**: For image storage and handling.

---

Enjoy building with **QUICKSERVE**!
