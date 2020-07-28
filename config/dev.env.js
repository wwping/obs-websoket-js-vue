/*
 * @Author: your name
 * @Date: 2020-07-26 13:39:46
 * @LastEditTime: 2020-07-28 14:01:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\config\dev.env.js
 */ 
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
})
