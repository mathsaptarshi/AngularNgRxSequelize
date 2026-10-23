const express = require('express');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors')
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ data: 'Running....' });
});

// Register API routes
app.use('/api', authRoutes);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Authenticate and sync database models
    await sequelize.authenticate();
    console.log('PostgreSQL database connected.');

    // sync({ alter: true }) updates tables without dropping them
    await sequelize.sync({ alter: true });
    console.log('Database synced.');

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();