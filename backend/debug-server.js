const express = require('express');
const path = require('path');

function argToString(a){
  try{
    if (typeof a === 'string') return a;
    if (!a) return String(a);
    if (Array.isArray(a)) return '[' + a.map(argToString).join(', ') + ']';
    if (a && a.name) return `[fn ${a.name}]`;
    return JSON.stringify(a);
  } catch(e){ return String(a); }
}

function wrap(proto, method){
  const orig = proto[method];
  proto[method] = function(...args){
    console.log(`DBG: ${method} called with ->`, argToString(args[0]));
    return orig.apply(this, args);
  };
}

wrap(express.application, 'use');
wrap(express.application, 'get');
wrap(express.application, 'post');
if (express.Router && express.Router.prototype) {
  wrap(express.Router.prototype, 'use');
  wrap(express.Router.prototype, 'get');
  wrap(express.Router.prototype, 'post');
}

console.log('DEBUG WRAPPER LOADED — now requiring server.js');
require('./server.js');
