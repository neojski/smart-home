const miio = require('miio');

const device = miio.createDevice({
    address: '192.168.0.14',
    token: 'dc917acca6195b529275a77556b8b352',
    model: 'zhimi.airpurifier.m1'
});

miio.device({ address: '192.168.0.14' })
    .then(device => {
        console.log('temperature: ' + device.temperature)
        console.log('humidity: ' + device.humidity)
        console.log('aqi: ' + device.aqi)

        console.log(device.modes);
        device.setMode('auto')
    })
    .catch(console.error);
