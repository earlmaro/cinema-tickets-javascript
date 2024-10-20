import express from 'express';
import dotenv from 'dotenv';
import ticketRoute from './routes/ticketRoute.js';
import InvalidPurchaseException from './src/pairtest/lib/InvalidPurchaseException.js';

// Load environment variables
dotenv.config({ path: './config/config.env' });

const app = express();

// Body parser middleware
app.use(express.json());

// Mount ticket router
app.use('/api/v1/tickets', ticketRoute);

// Error-handling middleware in Express
app.use((err, req, res, next) => {
    // Add some logging to verify middleware is working
    console.error('Error caught in middleware:', err);

    if (err instanceof InvalidPurchaseException) {
        res.status(err.getStatusCode()).json({
            status: false,
            errorCode: err.getErrorCode(),
            message: err.message,
        });
    } else {
        // Catch-all for other errors
        console.error('General error occurred:', err);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

// Port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));
