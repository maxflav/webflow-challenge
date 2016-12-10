# webflow-challenge
Screener question for Webflow interview.

To start the server, run with `node app.js`.

# API
Send a GET request to `/?path=[URL]` where `[URL]` is the input URL.

The response will be a JSON object with two possible fields:
- `error`: Contains an error message if there was an error with the request.
- `fonts`: Contains an array of strings with all font-families being displayed on the page.
