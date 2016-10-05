'use strict';

var platform = require('./platform'),
    isNaN = require('lodash.isnan'),
    inRange = require('lodash.inrange'),
    isNumber = require('lodash.isnumber'),
    isString = require('lodash.isstring'),
    isPlainObject = require('lodash.isplainobject'),
    geobing, geocoding_type;

var _handleException = function (requestId, error) {
    platform.sendResult(requestId, null);
    platform.handleException(error);
};

platform.on('data', function (requestId, data) {
    if (isPlainObject(data)) {
        if (geocoding_type === 'Forward') {
            if (!isString(data.address))
                return _handleException(requestId, new Error(`Invalid address. Address ${data.address}`));

            geobing.getCoordinates(data.address, function (err, coordinates) {
                if (err)
                    return _handleException(requestId, err);

                let result = {
                    lat: coordinates.lat,
                    lng: coordinates.lng
                };

                platform.sendResult(requestId, JSON.stringify({result: result}));

                platform.log(JSON.stringify({
                    title: 'Bing Maps Geocoding Service Result',
                    input: {
                        address: data.address
                    },
                    result: result
                }));
            });
        }
        else {
            if (isNaN(data.lat) || !isNumber(data.lat) || !inRange(data.lat, -90, 90) ||
                isNaN(data.lng) || !isNumber(data.lng) || !inRange(data.lng, -180, 180)) {
                return _handleException(requestId, new Error('Latitude (lat) and Longitude (lng) are not valid. lat: ' + data.lat + ' lng:' + data.lng));
            }

            geobing.getInfoFromCoordinates({lat: data.lat, lng: data.lng}, function (err, resp) {
                if (err)
                    return _handleException(requestId, err);

                let result = {
                    address: resp.name
                };

                platform.sendResult(requestId, JSON.stringify({result: result}));

                platform.log(JSON.stringify({
                    title: 'Bing Maps Geocoding Service Result',
                    input: {
                        lat: data.lat,
                        lng: data.lng
                    },
                    result: result
                }));
            });
        }
    }
    else
        _handleException(requestId, Error(`Invalid data received. Data must be a valid JSON Object. Data: ${data}`));

});

platform.once('close', function () {
    platform.notifyClose();
});

platform.once('ready', function (options) {
    let config = require('./config.json');

    geobing = require('geobing');
    geobing.setKey(options.api_key);

    geocoding_type = options.geocoding_type || config.geocoding_type.default;

    platform.notifyReady();
    platform.log('Bing Maps Geocoding Service has been initialized.');
});