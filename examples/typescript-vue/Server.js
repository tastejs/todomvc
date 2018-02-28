const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 7000;


app.use(morgan('tiny'));
app.get('*.js', function (req, res, next) {
  if (process.env.NODE_ENV === 'production'){
    
    var url = req.url + '.gz';
    if (fs.existsSync(`./dist${url}`)){
      req.url = url;
      res.set('Content-Encoding', 'gzip');
    }
    
    //Renvoie le fichier js zippé en production
  }
  next();
});

app.use(express.static(path.resolve(__dirname ,'dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
