const weather = require('./funciones.js')
const express = require('express')
const app = express()
const port = process.env.PORT|| 3000

app.get('/',function(req, res){
    res.send({
        greeting : 'Bienvenido LAB-6 Desarrollo WEB',
        altern: 'Intenta con el siguiente ejemplo /weather?search=Monterrey'
    })
})

app.get('/weather', function(req, res){
    if(!req.query.search){
        res.send({
            error: 'Envía el nombre de un lugar'
        })
    }
    else{
        weather.geoCode(req.query.search, function(error, response){
            if (error){
                return res.send({
                    error: error
                })
            }
            else if(response != undefined){
                weather.weather(response.lat, response.long, response.name, function(error,response){
                    if(error){
                        return res.send({
                            error: error
                        })
                    }
                    else{
                        res.send(response)
                    }
                })
            }
            else{
                res.send({
                    error: 'Existió algún tipo de error!!!'
                })
            }
        })
    }
})


app.get('*', function(req, res){
    res.send({
        error : 'Página no encontrada',
        altern: 'Intenta con el siguiente ejemplo /weather?search=Monterrey'
    })
})

app.listen(port, function(){
    console.log('up and runnning!')
})