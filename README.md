# nc-games-forum API (House of Games)
'nc-games-forum' is a C.R.U.D app that allows users to create, read, update, and delete reviews for various games. It provides API endpoints for retrieving and modifying data related to categories, reviews, and comments. The app can be run locally by cloning the repository, installing dependencies, and creating two .env files. 

Hosted version: https://aquamarine-conkies-2e9fe6.netlify.app/

## The minimum versions
Node.js v19.3.0.
Postgres 14.7

## Setup in local enviroment
Clone the repository:
git clone https://github.com/rovercode1/be-nc-games.git


Navigate to the project directory:

cd <project_directory>
i.e 
`
cd nc-games/
`

Install the dependencies:
npm install

database setup:
Create a .env.test and .env.development file
`.env.test` is used for your tests database.
`.env.development` is used for your dev database.
Make sure to add these .env files to your `.gitignore`

e.g: 

```
//.env.development
PGDATABASE=nc_games
//.env.test
PGDATABASE=nc_games_tests

```
type `npm run setup-dbs` and then `npm run seed`
`npm test setup-dbs` seeds the test database.
This will create the database, then seed the database with some initial data.

Start the server:
`npm start`
Will start the server.

Run tests:
`npm run test`

That's it! 



## API Endpoints
All availabe endpoints are listed here: https://games-forum.onrender.com/api

