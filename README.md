# Hacker News Reader

This is an example reader application for Hacker News.

This application uses the following:
 * The public Hacker News API
 * react
 * create-react-app
 * fresh-data
 * redux (via fresh-data)

### Try it out!

After cloning the repo, install and run the development server:

```sh
npm install
npm start
```

And your default browser should open to your local dev server.

### Debug info

In development mode, the React dev tools show the component structure, and the Redux dev tools can show the data fetching. For more debug logging, enter the following into the JS console:

`localStorage.debug = 'fresh-data:*,hn-example:*'`
