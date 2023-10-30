import app from "./server.js";
import db from "./db/index.js";
const PORT = parseInt(process.env.PORT) || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  db.close().then(() => {
    server.close(() => {
      console.log('Server shut down');
    });
  });
});
