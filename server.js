require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');

const assetsRouter = require('./server/assets-router');
const routes = require('./server/routes/index.route');

const app = express();

app.use(bodyParser.json());

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: true,
}));

app.use('/', routes);

app.use('/assets', assetsRouter);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const { PORT = 5000 } = process.env;

app.listen(PORT, () => {
  console.log(`\n  App running in port ${PORT} \n`);
  console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
});
