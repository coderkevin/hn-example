# Hacker News Reader

This is an example reader application for Hacker News.

This application uses the following:
 * The public Hacker News API
 * react
 * create-react-app
 * fresh-data
 * redux (via fresh-data)
 
## Features

 * Simple, clean interface
 * Single scrolling list with header and footer
 * Infinite scroll and dynamic loading (no need to click a "more" button)
 * Automatic, dynamic updates
   - The list refreshes automatically every 5 minutes, new stories are added at the top.
   - Individual stories refresh every 30 minutes, just in case something changes.
 * Offline support
   - *Coming Soon:* The application will run in an offline mode with data already retrieved.

## Try it out!

After cloning the repo, install and run the development server:

```sh
npm install
npm start
```

And your default browser should open to your local dev server.

## Debug info

In development mode, the React dev tools show the component structure, and the Redux dev tools can show the data fetching. For more debug logging, enter the following into the JS console:

`localStorage.debug = 'fresh-data:*,hn-example:*'`
