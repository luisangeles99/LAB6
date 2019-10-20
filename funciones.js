
const request = require('request')

if(process.env.NODE_ENV === 'production'){
    var credentials = process.env.API_KEY
}
else{
    var credentials= require('./credentials.js')
}

const geoCode = function(place, callback){
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + place + '.json?access_token=' + credentials.MAPBOX_TOKEN

    request({ url, json: true}, function(error, response){
        if(error){
            callback(error + 'You should check if the url is mispelled, or the Host server may be down in Mapbox', undefined)
        }
        else{
            const data1 = response.body
            if (data1.message){
                callback(data1.message + ' In Mapbox API', undefined)
            }
            else{
                const data1 = response.body.features
                if(data1[0] == null){
                    callback('Nombre del lugar es incorrecto o no existe, verificar input', undefined)
                }
                else{
                    const info1 = {
                        lat: data1[0].center[1],
                        long: data1[0].center[0],
                        name: data1[0].text
                    }
                    callback(undefined, info1)
                }
                
            }
        }
    })
}

const weather = function(lat, long, name, callback){
    const url= 'https://api.darksky.net/forecast/' + credentials.DARK_SKY_SECRET_KEY + '/' + lat + ',' + long + '?lang=es&units=si'
    request ({url, json: true}, function(error, response){
        if(error)
            callback(error + ' You should check if the url is mispelled, or the Host server may be down in DARKSKY API', undefined)
        else{
            const data = response.body
            if(data.error){
                callback(data.error + 'Please check the format in your request in DarkSKY API', undefined)
            }
            else {
                let probLluvia = data.daily.data[0].precipProbability
                probLluvia = probLluvia*100
                const txt ='Información del lugar: '+ name + '. ' + data.daily.data[0].summary + ' Actualmente esta a ' + data.currently.temperature + 'ºC. Hay ' + probLluvia + '% de probabilidad de lluvia.'  
                const send={
                    General: txt,
                    Lugar: name,
                    Coordenadas : {
                        latitud: lat,
                        longitud: long
                    },
                    Resumen: data.daily.data[0].summary,
                    Temperatura: data.currently.temperature + 'ºC',
                    probLluvia: probLluvia + '%'
                    
                }
                callback(undefined, send)
            }
            
        }
    })
}

module.exports = {
    geoCode: geoCode,
    weather: weather
}
