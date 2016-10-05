# Bing Maps Service Plugin
[![Build Status](https://travis-ci.org/Reekoh/mailgun-connector.svg)](https://travis-ci.org/Reekoh/bing-geocoding-service)
![Dependencies](https://img.shields.io/david/Reekoh/bing-geocoding-service.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/bing-geocoding-service.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

Bing Maps Service Plugin for the Reekoh IoT platform. Integrates a Reekoh instance to Bing Maps Geocoding API to do reverse and forward geocoding.

## Description
This plugin converts input(latitude & longitude/address) to to readable address/ latitude & longitude using Bing Maps Geocoding API.

## Configuration
To configure this plugin, a Microsoft account is needed to provide the following:

1. API Key - The Bing Maps API key to use.

Other Parameters:

1. Geocoding Type - The type of geocoding to perform.

These parameters are then injected to the plugin from the platform.