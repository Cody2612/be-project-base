# Northcoders News API

NC News API is my first backend API project built while learning **TDD**, **PSQL**, **Node.js**, **Express**, **Jest**, **Supertest**, **pg-format**, and **dotenv**. This project allows users to interact with articles, comments, users, and topics through a RESTful API with support for dynamic sorting, filtering, and paginated responses. The project follows Test-Driven Development (TDD) and is hosted on **Render** with a **Supabase** database.

Hosted version: [NC News API on Render](https://myfirstapi-vhbe.onrender.com)

## Summary

This API was developed to demonstrate backend skills using the following tools and frameworks:
- **Express** for handling HTTP requests.
- **PostgreSQL** as the database management system.
- **Node.js** to build and serve the API.
- **Jest** and **Supertest** for testing endpoints and models.
- **dotenv** to manage environment variables securely.
- **pg-format** to dynamically format SQL queries.

The API endpoints provide access to:
- A list of articles, topics, users, and comments.
- Options to sort and filter articles based on various criteria.
- Functionality to post, update, and delete comments.
- Voting on articles and comments to demonstrate more complex database interactions.

## Getting Started

### Prerequisites and minimum versions

- Node.js: Version 14.x or higher
- PostgreSQL: Version 12.x or higher


### Installation

1. **Clone the repository**:
   ```zsh
   git clone https://github.com/Cody2612/be-project-base.git
   cd be-project-base
   ```
2. **Install dependencies**:
   ```zsh
   npm install
   ```
3. **Set up PostgreSQL databases**:
   ```zsh
    CREATE DATABASE nc_news;
    CREATE DATABASE nc_news_test;
   ```
4. **Environment Variables**:
Create two .env files in the root directory:

    .env.development: contains your development database name.
    .env.test: contains your test database name.

    Examples:
    .env.development 
   ```zsh
   PGDATABASE=nc_news
   ```
   .env.test
   ```zsh
   PGDATABASE=nc_news_test
   ```
5. **Seed the Development Database**:
   ```zsh
   npm run seed
   ```
6. **Run your test**:
   ```zsh
   npm test
   ```

## Running the API locally

### Start your local server

```zsh
npm start 
```
### Access the API locally

```
http://localhost:9090/api
```
## Endpoints

All the endpoints found [here](https://myfirstapi-vhbe.onrender.com/api). This link provides a JSON response describing all available endpoints, along with example requests and responses for each.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
