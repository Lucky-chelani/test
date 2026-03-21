// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// // For cost control, you can set the maximum number of containers that can be
// // running at the same time. This helps mitigate the impact of unexpected
// // traffic spikes by instead downgrading performance. This limit is a
// // per-function limit. You can override the limit for each function using the
// // `maxInstances` option in the function's options, e.g.
// // `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// // NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// // functions should each use functions.runWith({ maxInstances: 10 }) instead.
// // In the v1 API, each function can only serve one request per container, so
// // this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });


const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// List of common bots & social media scrapers we want to intercept
const BOTS = [
  'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
  'twitterbot', 'facebookexternalhit', 'linkedinbot', 'embedly',
  'baiduspider', 'pinterest', 'slackbot', 'vkshare', 'facebot',
  'outbrain', 'w3c_validator', 'whatsapp', 'telegrambot'
];

app.get(/.*/, async (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOTS.some(bot => userAgent.toLowerCase().includes(bot));

  if (isBot) {
    // 🤖 IT'S A BOT! Ask Prerender.io to render the JavaScript
    const targetUrl = `https://www.trovia.in${req.originalUrl}`; 
    const prerenderUrl = `https://service.prerender.io/${targetUrl}`;

    try {
      const response = await fetch(prerenderUrl, {
        headers: {
          // 🔒 SECURE: Pulls the token from the hidden .env file
          'X-Prerender-Token': process.env.PRERENDER_TOKEN 
        }
      });
      const html = await response.text();

      // Cache this response in Firebase CDN for 24 hours
      res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      return res.status(200).send(html);

    } catch (error) {
      console.error("Prerender error:", error);
    }
  }

  // 👨‍💻 IT'S A HUMAN! Serve the normal React App.
  try {
    const indexPath = path.resolve(__dirname, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    return res.status(200).send(html);
  } catch (error) {
    console.error("Could not find index.html.", error);
    return res.status(500).send("Server Error: Missing index.html in functions folder.");
  }
});

exports.seoRender = onRequest({ maxInstances: 10, memory: "256MiB" }, app);