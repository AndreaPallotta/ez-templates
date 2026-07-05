# ExpressJS template

## Requirements

| Requirement | Version  |
|-------------|----------|
| NodeJS      | 16+      |
| Docker      | 20.10.8+ |
| NPM         | 8+       |

---

## Features

- JWT generation (auth and refresh tokens) and validation (as middleware)
- Rate limiter
- Custom HTTP errors messages
- Custom Logger
  - Log to console with different colors
  - Log to file `./logs/*`
  - Selectable log level in `.env`
- Default `.env` file generated with setup scripts `./setup/env-gen.*`
- Jest unit tests
- Caching requests
  - Customizable in `.env`
- `express-validator` validation middleware
- Basic docker integration
- Hot reload with `nodemon`
- Absolute paths

---

## How to run the code

### Setup

1. Clone the repository.

    ```bash
    git clone git@github.com:AndreaPallotta/Templates.git
    ```

2. Navigate to the express directory

    ```bash
    cd Template/express
    ```

3. Run setup script to generate the `.env` file

    ```bash
    ./setup/env-gen.sh # UNIX
    ./setup/env-gen.bat # WINDOWS
    ```

4. Modify the .env file with your preferences

5. Install NPM packages

    ```bash
    npm install
    ```

### CLI

1. Run npm start from the `express` directory

    ```bash
    npm start
    ```

### DOCKER

1. If you modified the port number in the `.env` file, modify the `Dockerfile`

    - Open the `Dockerfile`
    - On line 8, change `EXPOSE 8081` with the same port in the `.env` file

2. From the CLI, build the docker image from the `express` directory

    ```bash
    docker build . -t express-node-app # The name is up to you
    ```

3. Verify that the image has been created successfully

    ```bash
    docker images

    # Example
    REPOSITORY         TAG        ID              CREATED
    node               16         3b66eb585643    5 days ago
    express-node-app   latest     d64d3505b0d2    1 minute ago
    ```

4. Run the image

    ```bash
    docker run -p 49160:<port-number> -d express-node-app
    # The port number depends on the EXPOSE field in the Dockerfile
    ```

5. Verify that the express server is running

    ```bash
    # Get container ID
    $ docker ps

    # Print app output
    $ docker logs <container id>

    # What you should see
    Server started on <host>:<port-number>
    ```

6. Stop the image

    ```bash
    docker kill <container id>
    ```

---

## How to add new absolute paths

Within the application, you can see that absolute paths are implemented (i.e. `require(@<path-keyword>/)`).

### To add a new folder to the paths

1. Open `package.json`
2. Locate the `_moduleAliases` object (below the `scripts` object)
3. Add a new entry with the following format: `"<alias>": "<folderName>/"`:
   - The key is the `<alias>`. For example `@log` is the alias for the `logging` folder
   - The value is the relative path to the folder. For example `logging/` refers to `./logging`.
&nbsp;

4. Open `jest.config.js`
5. Locate the `moduleNameMapper` object
6. Add a new entry with the following format: `'<alias>/(.*)': "'<rootDir>/<folderName>/$1"`.
   - `<rootDir>` is the path to the folder (default: `./`)
&nbsp;

7. Open `jsonconfig.json`.
8. Under `compilerOptions[path]` add a new entry with the following format: `"<alias>/*": ["<rootDir>/<folderName>/*"]`

#### Variables Table (if explaination above is not clear)

| Variable         | Description                     | Example |
|------------------|---------------------------------|---------|
| **alias**      | The name of the absolute import | @log    |
| **rootDir**    | The path to the target folder   | ./      |
| **folderName** | The target folder name          | logging |

**_NOTE:_**
`<alias>` `<rootDir>`, and `<folderName>` need to be the same for each new declaration. Otherwise, there might be inconsistencies and unwanted issues.

---

## Testing

### Unit tests

1. (Optional) In the `tests` folder, add new tests if needed. Each file needs formatted as `<filename>.test.js` in order for `Jest` to include it in the test suite.

2. (Optional) Modify how the test suite is executed:
    - Modify `jest.config.js`
    - If you want to use a different file or flags, modify the `test` npm command in `packages.json`.

    > **_NOTE:_**
    Removing `cross-env NODE_ENV=test` from the npm command will cause the node environment to be `development`.

3. Run tests

    ```bash
        npm run tests
    ```

### Security Tests

1. Install snyk

    ```bash
    [sudo] npm install -g snyk
    ```

2. Test for vulnerabilities

     ```bash
    # Package vulnerabilities
    npm audit
    # Generic vulnerabilities
    snyk test
    # If you are using SQL-based DBs
    python sqlmap.py --help # https://www.sqlinjection.net/sqlmap/tutorial/
    ```

3. Patch snyk vulnerabilities

    ```bash
    snyk wizard
    ```

4. Extra security

   ```bash
    # Use safe-regex to prevent regex DDoS attacks
    npm install safe-regex
    ```

    ```js
    const safe = require('safe-regex');
    safe(*regex*);
    ```

---

## Validation

This template uses `express-validator@6.14.2` for validation.

A middleware is already implemented to manage returning an error.
However, it is possible to implement a custom validation for any route.

### Add new validators

#### With middleware

1. Create a new file `<route-folder>/<route-folder>.validator.js`

2. Add a new function that implements the middleware

```js
const { body } = require('express-validator'); // this example creates a validator for a POST request
const validate = require('@utils/validator'); // middleware

exports.validatePOST = validate([
    body('<body param name 1>', '<error message (not required)'>).<conditions>(),
    body('<body param name 2>', '<error message (not required)'>).<conditions>(),
]);

```

#### Without middleware

View [express-validator docs](https://express-validator.github.io/docs/index.html)
