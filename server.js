// const moduleAlias = require('module-alias');
// moduleAlias.addAliases({   
//     '@models'   :  './models/connection.js',
//         '@schema'   :   __dirname + '/models/schema',
//         '@userEvent'    :   __dirname + '/models/events/user',    
// });

//db connection
require('./models/connection').connectDB();

const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(require('./routes'))

app.use(    (req,res)   =>  {
    res.status(404).send('Unknown Request');
})

app.listen(9999,    ()  =>  {
    console.log('Server Running...');
})
