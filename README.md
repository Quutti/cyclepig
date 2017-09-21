# Cyclepig

Work in progress! 
Cycling related distance / maintenance -diary webapp

## Installing

SQL Database (MySQL, PostgreSQL, SQLite etc) is required. Install one and init database with file server/sql-database.sql

.env file is also required inside server directory. File should contain at least following properties

```
SERVER_PORT={PORT}

DEVELOPMENT_MODE=true

PASSWORD_SYSTEM_SALT={RANDOM_STRING_YOU_MUST_CHOOSE}
JWT_KEY={RANDOM_STRING_YOU_MUST_CHOOSE}

SQL_HOST={SQL_SERVER_HOST_ADDRESS}
SQL_PORT={SQL_SERVER_HOST_PORT}
SQL_USER={SQL_USERNAME}
SQL_PASS={SQL_PASSWORD}
SQL_DB={SQL_DATABASE_NAME}
```

## Building

```
cd server
npm install

cd ../client
npm install
```

## Starting

Both client and server can be run in a development mode

```
# Uses nodemon to restart a server when code is changed
cd server
npm run dev

# Uses webpack to swap modules and refresh a browser when code is changed
cd ../client
npm run dev
```

## And coding style tests

Typescript formatting should be used. Also following Angular guidelines is recommended practise. [Angular StyleGuide](https://angular.io/guide/styleguide)

## Authors

* **Jokke Liikkanen** - *Initial work* - [Quutti](https://github.com/Quutti)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details