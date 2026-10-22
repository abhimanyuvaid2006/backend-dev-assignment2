// import the express application and type definition
import express, { Express } from "express";
import morgan from "morgan";
import ticketRoutes from "./api/v1/routes/ticketRoutes";

const app: Express = express();

interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

app.use(morgan("combined"));

app.use(express.json());

/**
 * Health check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */
app.get("/api/v1/health", (req, res) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
});

app.use("/api/v1/tickets", ticketRoutes);

export default app;