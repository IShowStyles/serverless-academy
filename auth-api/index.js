import app from "./server.js";

const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
