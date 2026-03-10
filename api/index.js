
const server = require('../dist/social-app/server/main.js');

module.exports = async (req, res) => {
    console.log('🔵 Request received:', req.url);

    try {

        const app = server.app ? server.app() : server;
        return app(req, res);
    } catch (error) {
        console.error('🔴 SSR Error:', error);

        // Fallback: serve the client-side app if SSR fails
        res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Loading...</title>
          <base href="/">
        </head>
        <body>
          <app-root></app-root>
          <script src="/main.js"></script>
        </body>
      </html>
    `);
    }
};