# tellstickjs

Super small nodejs tellstick event handler

This project is not new, but for some reason I havent put it on github. Well, now its here.

The events sent from tellduscore have changed very little, but there is one small change that broke the whole code.

## Requirements

To use this, you need to have TelldusCore installed. I have only tested this on Ubuntu and Raspbian. 
(More on TelldusCore for the Raspberry here](http://elinux.org/R-Pi_Tellstick_core)

## Install

    npm install tellstickjs

## How to use

    const tellstick = require('tellstickjs').init();

    tellstick.on('turnon', event => {
        console.log(event);
    });
    
    tellstick.on('turnoff', event => {
        console.log(event);
    });

## Docker

Since TelldusCore takes some steps to get it working, I'm working on a Docker image with it installed and tellstickjs so you can use it directly. It might not suit everyone but it works pretty good, without the need to install all TelldusCore things on your host computer.

