exports.handler = async function() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // אפשר לשנות לדומיין ספציפי בפרודקשן
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ apiKey: process.env.OPENAI_API_KEY })
  };
}; 