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
   - The application will run in an offline mode with data already retrieved.
	 - The last 2 days of data is also cached in the browser for offline use and page load performance.

## Try it out!

After cloning the repo, install and run the development server:

```sh
npm install
npm start
```

And your default browser should open to your local dev server.

## Try out offline mode

```sh
npm install -g serve
npm run build
serve -s build
```

Steps to view offline:

1. Visit `http://localhost:5000` in your browser for the initial load of the application.
2. Scroll down to load more stories as you wish.
3. Close the localhost tab.
4. Hit `Ctrl-C` in your terminal to stop serving the app.
5. Disable your network connection to the computer, view a page in the browser to confirm no connection.
6. Open a new tab to `http://localhost:5000` and view the app with cached data.

Note: This verification can also be accomplished with the "Offline" checkbox in your browser dev tools.

## Debug info

In both development and production for this app, enter the following into the JS console:
`localStorage.debug = 'fresh-data:*,hn-example:*'`

In development mode, the React dev tools show the component structure, and the Redux dev tools can show the data fetching.
