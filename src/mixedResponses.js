const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  if (type === 'application/json') response.write(JSON.stringify(content));
  else response.write(content);
  response.end();
};

const sortResponse = (request, response, status, object, acceptedTypes) => {
  if (acceptedTypes && acceptedTypes[0] === 'text/xml') {
    let responseXML = `<response><message>${object.message}</message>`;
    if (object.id) responseXML += `<id>${object.id}</id>`;
    responseXML += '</response>';
    return respond(request, response, status, responseXML, 'text/xml');
  }
  return respond(request, response, status, object, 'application/json');
};

// #region messages
const success = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  return sortResponse(request, response, 200, responseJSON, acceptedTypes);
};

const badRequest = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    return sortResponse(request, response, 400, responseJSON, acceptedTypes);
  }

  return sortResponse(request, response, 200, responseJSON, acceptedTypes);
};

const unauthorized = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'You have successfully viewed the content',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';
    return sortResponse(request, response, 401, responseJSON, acceptedTypes);
  }

  return sortResponse(request, response, 200, responseJSON, acceptedTypes);
};

const forbidden = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  return sortResponse(request, response, 403, responseJSON, acceptedTypes);
};

const internal = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  return sortResponse(request, response, 500, responseJSON, acceptedTypes);
};

const notImplemented = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  return sortResponse(request, response, 501, responseJSON, acceptedTypes);
};

const notFound = (request, response, acceptedTypes) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with error message
  return sortResponse(request, response, 404, responseJSON, acceptedTypes);
};

// #endregion

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
