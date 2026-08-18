import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(
    cors({
    origin: "*",
})
);

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Pixel Commerce Backend is running"
    });
});

app.use("/api/v1", routes);
 
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

app.use(errorMiddleware);

export default app;