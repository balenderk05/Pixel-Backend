import app from "./app.js";
import env from "./config/env.js";
import os from "os";
import connectDatabase from "./config/database.js";

const getNetworkIP = () => {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const networkList = interfaces[name];
    if (networkList) {
      for (const network of networkList) {
        if (network.family === "IPv4" && !network.internal) {
          return network.address;
        }
      }
    }
  }

  return "localhost";
};

const startServer = async () => {
  try {
    
    await connectDatabase();

    const server = app.listen(env.port, "0.0.0.0", () => {
      const networkIP = getNetworkIP();
      console.log("");
      console.log("✓ Backend ready");
      console.log("");
      console.log(`- Local:    http://localhost:${env.port}`);
      console.log(`- Network:  http://${networkIP}:${env.port}`);
      console.log("");
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down server...`);

      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error);

    process.exit(1);
  }
};

startServer();
