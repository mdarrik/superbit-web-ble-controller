// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
/**
 * @typedef {import('@netlify/functions/dist/function/event')} FunctionEvent
 * @type {(event: FunctionEvent, context: any) => any}
 */
const handler = async (event) => {
  try {
    const body = event.body;
    console.log(JSON.parse(body));
    return {
      statusCode: 200,
      body: "log received",
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
