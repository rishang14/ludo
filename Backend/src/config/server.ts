import { app, server } from "../index.ts";

const exapp = app;
const httpserver = server;

exapp.listen(8000, () => {
  console.log(" Listening on port 8000");
});

httpserver.listen(8001, () => {
  console.log("Server running on port 8001");
});
