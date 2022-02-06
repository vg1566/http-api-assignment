const http = require('http'); // http module
const url = require('url'); // url module
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const mixedHandler = require('./mixedResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// object to route requests to proper handlers
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/success': mixedHandler.success,
    '/badRequest': mixedHandler.badRequest,
    '/unauthorized': mixedHandler.unauthorized,
    '/forbidden': mixedHandler.forbidden,
    '/internal': mixedHandler.internal,
    '/notImplemented': mixedHandler.notImplemented,
    notFound: mixedHandler.notFound,
  },
  HEAD: {
    notFound: mixedHandler.notFoundMeta,
  },
};

const onRequest = (request, response) => {
  // parse info from url
  const parsedUrl = url.parse(request.url);

  // grab params
  const params = query.parse(parsedUrl.query);

  // grab accepted types
  const acceptedTypes = request.headers.accept.split(',');

  // handle the request. If no handler found, use notFound
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct[request.method].notFound(request, response, acceptedTypes);
  }
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
