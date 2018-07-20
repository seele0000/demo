'use strict';
const db = require('./db');
const Koa = require('koa');
const cors = require('koa2-cors');
const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');   // 解析post接收参数

// async、await 和 Promise----------------------------------

const wait1 = (n) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('wait1', ++n);
      resolve(++n);
    }, 1000)
  })
}

async function test() {
  let a = await wait1(1);
  let b = await wait2(a);
  console.log('a', a, 'b', b);
}
// test();

const wait2 = (n) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('wait2', ++n);
      resolve(++n);
    }, 1000)
  })
}

/* 
  打印结果
  wait1 2
  wait2 4
  a 3 b 5
*/

// 数据库-----------------------------------------------
// findList();

async function findList() {
  let inTheaterList = [];
  await db.in_theater.findAll({
    attributes: ['id', 'movieId', 'title', 'castsStr', 'directorsStr'],
    // where: {
    //   movieId: '26752088'
    // },
    limit: 1
    }).then(_data => {  
      // console.log('_data',_data[0].dataValues)  
      handle(_data, function(list) {
        console.log('inTheaterList',list)
      });
      
    }).catch(reject => {
      console.log(reject);
    });
}

async function handle(_data, cb) {
  let list = [];
  let tmpO = {};
  let tmpPersonO = {};
  let castsArr = [];
  let directorsArr = [];

  for(let i=0; i<_data.length; i++) {
    tmpO = _data[i].dataValues;
    tmpO.casts = [];
    tmpO.directors = [];
    castsArr = _data[i].dataValues.castsStr.slice(0,-1).split(',');
    directorsArr = _data[i].dataValues.directorsStr.slice(0,-1).split(',');
    
    for(let j=0; j<castsArr.length; j++) {
      tmpPersonO = await dbFindPerson('person','personId',castsArr[j]);
      tmpO.casts.push(tmpPersonO);
    }
    for(let j=0; j<directorsArr.length; j++) {
      tmpPersonO = await dbFindPerson('person','personId',directorsArr[j]);
      tmpO.directors.push(tmpPersonO);
    }
    list.push(tmpO)
  }
  cb && cb(list);
}

const dbFindPerson = (dbName, keyName, keyV)=> {
  let o = {};
  let obj ={};
  o[keyName] = keyV;
  return new Promise(resolve => {
    db[dbName].findAll({
      attributes: ['personId', 'name', 'type', 'avatars_small', 'avatars_large', 'avatars_medium'],
      where: o
      }).then(_data => {
        // console.log('dbFindPerson _data',_data)
        if(_data.length) {          
          obj.personId = keyV;
          obj.name = _data[0].dataValues.name;
          obj.type = _data[0].dataValues.type;
          obj.avatars_small = _data[0].dataValues.avatars_small;
          obj.avatars_large = _data[0].dataValues.avatars_large;
          obj.avatars_medium = _data[0].dataValues.avatars_medium;
          resolve(obj);
        } else {
          resolve(400)
        }
      }).catch(reject => {
        resolve(500);
      });   
  })
};

app.listen(3000);
console.log('start 3000');