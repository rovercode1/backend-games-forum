# nc-games-forum API (House of Games)
'nc-games-forum' is a C.R.U.D app that allows users to create, read, update, and delete reviews for various games. It provides API endpoints for retrieving and modifying data related to categories, reviews, and comments. The app can be run locally by cloning the repository, installing dependencies, and creating two .env files. 

##The minimum versions
Node.js v19.3.0.
Postgres 14.7

## Inital setup
First thing to do is set up your enviroment variables. 
This can be done by creating a _.env_ file.
`.env.test` is used for your tests database.
`.env.development` is used for your dev database.

e.g: 

```
//.env.development
PGDATABASE=nc_games
//.env.test
PGDATABASE=nc_games_tests

```
Make sure to add these .env files to your `.gitignore`

##API Endpoints
All availabe endpoints are listed here: https://games-forum.onrender.com/api

