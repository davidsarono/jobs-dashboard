# Jobs Dashboard

[React](https://beta.reactjs.org/) and [ExpressJS](https://expressjs.com/) App that provide `auth`, `job list` and `job detail` with integration with external service.

This app made with boilerplate from [React-and-Express-boilerplate](https://github.com/vanaldito/React-and-Express-boilerplate)


## How to run
1. create `.env` file from `.env.example` and fill its value with yours
```bash
cp .env.example .env
```

2. install all dependencies with `yarn`
3. run migration with `yarn migrate`
4. create user
```bash
curl --location --request GET 'localhost:5000/api/v1/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": <your_email>,
    "password": <your_password>
}'
```
5. login to `localhost:5000/login`
6. make sure all functionality works well