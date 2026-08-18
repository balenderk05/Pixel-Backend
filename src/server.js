import app from "./app.js";
import env from "./config/env.js";
import connectDatabase from "./config/database.js";

const startServer = async () => {
    try {
        await connectDatabase();

        const server = app.listen(env.port, () => {
            console.log(
                `Server is running on port ${env.port}`
            );
        });

        const shutdown = (signal) => {
            console.log(
                `${signal} received. Shutting down server...`
            );

            server.close(() => {
                console.log("HTTP server closed.");
                process.exit(0);
            });
        };

        process.on(
            "SIGINT",
            () => shutdown("SIGINT")
        );

        process.on(
            "SIGTERM",
            () => shutdown("SIGTERM")
        );

    } catch (error) {
        console.error(
            "Failed to start server:",
            error
        );

        process.exit(1);
    }
};

startServer();