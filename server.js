const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

let flags = {
  '--enable-editor': false
}

process.argv.forEach(arg => arg in flags && (flags[arg] = true));

let app = express();

app.use(express.static(path.join(__dirname, 'static')));

// view engine setup (PUG!)
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'pug');

// also this dam cors
app.use(cors({ allowedHeaders: 'Content-Type, Cache-Control' }));
app.options('*', cors());
app.use(bodyParser.json({ limit: '50mb' }));

// routes
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/public'))
if(flags['--enable-editor'])
  app.use('/editor', require('./routers/editor'))

app.listen(process.env.PORT || 3000);

module.exports = app;
