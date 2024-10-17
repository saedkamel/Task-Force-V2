# Task-Force Backend Documentation

## Project Overview

This project is a RESTful API built with Node.js, Express, and MongoDB, designed to handle user authentication and to-do management. The application uses JSON Web Tokens (JWT) for secure routes and includes endpoints for creating and managing users and to-do items.

## Setup and Installation

### Prerequisites:

- Node.js
- MongoDB
- A `.env` file with the following variables:
  - `ACCESS_TOKEN_SECRET` (JWT secret for signing tokens)
  - `connectionString` (MongoDB connection string)

### Installation Steps:

1. Install dependencies by running:
   ```bash
   npm install
   ```
2. Create a `.env` file and add your environment variables.
3. Start the server:
   ```bash
   node index.js
   ```
   The server will be running on port 8000.

## Endpoints

### 1. User Management

#### Create Account

- **Endpoint**: `POST /create-account`
- **Description**: Creates a new user account.

#### Login

- **Endpoint**: `POST /login`
- **Description**: Logs in a user and provides a JWT token.

#### Get User

- **Endpoint**: `GET /get-user`
- **Description**: Retrieves user details.
- **Requires**: Bearer token (JWT).

### 2. To-Do Management

#### Add To-Do

- **Endpoint**: `POST /add-todo`
- **Description**: Adds a new to-do for the logged-in user.

#### Edit To-Do

- **Endpoint**: `PUT /edit-todo/:todoId`
- **Description**: Edits an existing to-do item.

#### Get All To-Dos

- **Endpoint**: `GET /get-all-todo`
- **Description**: Retrieves all to-dos for the logged-in user, sorted by pinned status.

#### Delete To-Do

- **Endpoint**: `DELETE /delete-todo/:todoId`
- **Description**: Deletes a specific to-do item.

#### Update Pinned Status

- **Endpoint**: `PUT /update-pinned-todo/:todoId`
- **Description**: Updates the pinned status of a specific to-do item.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and to-do information.
- **Mongoose**: ODM for MongoDB.
- **JWT**: JSON Web Tokens for authentication.
- **dotenv**: Loads environment variables from a `.env` file.
