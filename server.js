const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// origin: ['http://localhost:3000', 'https://dev-gymini.onrender.com']
app.use(
  cors({
    origin: 'https://dev-gymini.onrender.com',
  })
);

app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve frontend
/*
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'client', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production. . .'));
}
*/

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
