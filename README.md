
# Image Service API

The Image Service API is a robust and flexible microservice for managing image files, including features for uploading, retrieving, updating, deleting, and listing images with associated metadata. The service is built using Node.js, TypeScript, and MongoDB and is designed to be containerized with Docker for easy deployment and scalability.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Service](#running-the-service)
- [Stopping the Service](#stopping-the-service)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v22.x or later)
- **Docker** (v20.10 or later)
- **Docker Compose** (v2.x or later)
- **MongoDB** (if not using Docker)

## Installation

To get started, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/yourusername/image-service.git
cd image-service
npm install
```

## Running the Service with Docker

It is currently recommended to run the service using Docker to ensure all prerequisites are met:

1. Build and start the Docker containers:

   ```bash
   docker compose up --build
   ```
The first startup might take some time while the service initializes. Please wait until you see the message: ‘Server is running on port 3000.’
2. The API documentation is hosted on the service itself. Once the service is running, you can access the Swagger UI at:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Stopping the Service

To stop the service:

- **If running locally:**

  Press `Ctrl + C` in the terminal.

- **If running with Docker:**

  ```bash
  docker-compose down
  ```

This will stop all running containers and remove them.

## Features

- **Image Upload:** Upload new images with metadata.
- **Image Retrieval:** Retrieve images and their associated metadata.
- **Image Update:** Update existing images and their metadata.
- **Image Deletion:** Delete images from the system.
- **Image Listing:** List images with various filters, including tags, duplication, and sorting options.
- **AWS S3 Integration:** Store images securely using AWS S3.
- **Swagger/OpenAPI Documentation:** View the API documentation online.


## Directory Structure

```bash
image-service/
├── src/
│   ├── config/          # Configuration files (e.g., MongoDB, AWS)
│   ├── controllers/     # Express route controllers for all endpoints
│   ├── dto/             # Data transfer objects
│   ├── middleware/      # Custom Express middleware
│   ├── models/          # Mongoose models and schemas
│   ├── repositories/    # Data access layer for MongoDB
│   ├── services/        # Business logic layer
│   ├── utils/           # Utility functions
│   └── index.ts         # Entry point of the application
├── tests/               # Test cases for the application
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Dockerfile for containerization
├── .env                 # Environment variables
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License.
