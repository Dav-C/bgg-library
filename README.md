# Board Game Library

## What is this?
A fun way to view a user's public board game library as provided by <a href="https://www.boardgamegeek.com">Board Game Geek</a>
_________________________

### Getting Started
___________________
Install dependencies

    npm install

Create a `.env.local` file in the project root and add your BGG API token:

    BGG_API_TOKEN=your_token_here

This token is required by the server-side API routes (`/api/collection` and `/api/thing`) that proxy requests to the
BoardGameGeek API. Without it the app will start but all library and game detail fetches will fail with a 500 error.

Start the development server

    npm run dev

Open a browser and view the site

    http://localhost:3000
___________________

### Using the App

To load a user's library simply enter a valid Board Game Geek username into the form on the main page and click the
<i>Load Library</i> button.

BGG will cache the request for processing and return status 202 until the request has been processed. 
<code>UseFetchControl.js</code> will make 4 attempts to load a user's library before timing out and presenting a message
asking the user to wait for a short period before trying another request. Most user's libraries will load within the 
4 request limit, but some larger libraries may take longer.

As soon as <code>UseFetchControl.js</code> receives a 200 status response, the XML returned by BGG is parsed and loaded
into <code>userDataSlice.js</code>. <code>appStateSlice.js</code>, <code>formStatusSlice.js</code> and 
<code>userDataSlice.js</code> are used to distribute data to the various components as needed.

All BGG API requests are proxied server-side through Next.js API routes to avoid CORS restrictions. The routes forward
the response status and body back to the client unchanged.

Once a library has been loaded the results can be filtered by using switches in the sidebar menu. Data does not persist 
through refreshes. Any page refreshes will result in the app returning to its default state and the username input form
will again be presented.

Clicking on a game image will open a modal with additional details about the game.

___________________

### Testing

All tests are run through Cypress (v15). The development server must be running before executing tests.

**Terminal 1** — start the dev server:

    npm run dev

**Terminal 2** — run the tests:

    npx cypress run

Alternatively, open the interactive Cypress GUI with:

    npx cypress open

Test specs are located in `cypress/e2e/tests/`. Once the tests have completed the coverage report can be viewed by
opening `coverage/lcov-report/index.html` in a browser.

