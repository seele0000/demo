'use strict';
const db = require('./db');
const Koa = require('koa');
const cors = require('koa2-cors');
const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');   // 解析post接收参数


/* 
  状态码：
  200： 成功
  300： 已存在
  400:  不存在
  500： 错误
*/


// 解决跨域问题
app.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return false;
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(bodyParser());

const dbFind = (dbName, keyName, keyV)=> {
  let o = {};
  o[keyName] = keyV;
  return new Promise(resolve => {
    db[dbName].findAll({
      attributes: ['id'],
      where: o
      }).then(_data => {
        // console.log('_data',_data)
        if(_data.length) {
          resolve(300);
        } else {
          resolve(400)
        }
      }).catch(reject => {
        resolve(500);
      });   
  })
}

router.post('/message/insert', async (ctx, next) => {
  let paramO = ctx.request.body.params;
  let curDate = new Date();
  let year = curDate.getFullYear();
  let month = curDate.getMonth()+1;
  let day = curDate.getDate();        // 获取系统日，
  let hour = curDate.getHours();      // 获取系统时，
  let min = curDate.getMinutes();     // 分
  let second = curDate.getSeconds();  // 秒
  let curTime = year +'-'+ month +'-'+ day +' '+ hour +':'+ min +':'+ second;
  console.log('curTime',curTime)
  console.log('name',paramO.name)
  await db.message.create({
		movieId: paramO.movieId,
    title: paramO.title,
    msg: paramO.msg,
    time: curTime,
    name: paramO.name
	})
	.then(_data => {
    console.log('_data',_data.dataValues)
    ctx.body = {
      code: 200,
      msg: '提交成功'
    }
	})
	.catch(e => {
    console.log('error',e)
    ctx.body = {
      code: 500
    }
	});
});

router.post('/message/list', async (ctx, next) => {
  let paramO = ctx.request.body.params;
  let list = [];
  await db.message.findAll({
    attributes: ['id', 'movieId', 'title','msg', 'name', 'time'],
    where: {
      movieId: paramO.movieId
    }
  }).then(_data => {
    for(let i=0; i<_data.length; i++) {
      list.push(_data[i].dataValues)
    }
    ctx.body = {
      code: 200,
      data: list
    }
  }).catch(reject => {
    console.log(reject);
    ctx.body = {
      code: 500,
      data: _data[0].dataValues
    }
  });
});

router.post('/user/create', async (ctx, next) => {
  let userParamO = ctx.request.body.params;
  let o = {
    code: 0,
    data: {}
  };
  await db.user.findAll({
    attributes: ['id', 'name', 'password'],
    where: {
      name: userParamO.name
    }
    }).then(_data => {
      o.code = 300;
      o.data = _data[0].dataValues;
    }).catch(reject => {
      console.log(reject);
      o.code = 500;
    });
  
  if(o.code == 300) {
    ctx.body = {
      code: 300,
      msg: '已存在'
    }
  } else {
    await db.user.create({
      name: userParamO.name,
      password: userParamO.password
    })
    .then(_data => {
      console.log('_data',_data.dataValues)
      ctx.body = {
        code: 200,
        msg: '成功'
      }
    })
    .catch(e => {
      console.log('error',e)
      ctx.body = {
        code: 500
      } 
    })
  }
});

router.post('/user/find', async (ctx, next) => {
  let userParamO = ctx.request.body.params;
  let code = 0;
  let msg = '';
  console.log(ctx.request.method)
  if (ctx.request.method == "OPTIONS") {
    ctx.body = 201;
  }
  await db.user.findAll({
    attributes: ['id', 'name', 'password'],
    where: {
      name: userParamO.name
    }
    }).then(_data => {
      if(userParamO.password == _data[0].dataValues.password) {
        code = 200;
        msg = 'ok';
      } else {
        code = 400;
        msg = '密码错误'
      }
      ctx.body = {
        code: code,
        msg: msg
      }
    }).catch(reject => {
      console.log(reject);
      ctx.body = {
        code: 500,
        msg: '用户名不存在'
      }
    });
});

router.post('/douban/insert', async (ctx, next) => {
  let paramO = ctx.request.body.params;
  let list = paramO.list;
  let castsIdGroup = '';
  let directorsIdGroup = '';
  let genresGroup = '';
  let count = 0;  
  let tmpMovieCode = 0;
  let tmpPersonCode = 0;

  for(let i=0; i<list.length; i++) {
    // in_theater
    castsIdGroup = '';
    directorsIdGroup = '';
    genresGroup = '';
    tmpMovieCode = 0;
    tmpPersonCode = 0;

    for(let j=0; j<list[i].casts.length; j++) {
      castsIdGroup += list[i].casts[j].id + ',';
      tmpPersonCode = await dbFind('person','personId',list[i].casts[j].id);
      console.log('tmpPersonCode >>>>>>', tmpPersonCode, list[i].casts[j].name)
      if(tmpPersonCode == 400) {
        await db.person.create({
          personId: list[i].casts[j].id,
          name: list[i].casts[j].name,
          type: 'cast',
          avatars_small: list[i].casts[j].avatars.small,
          avatars_large: list[i].casts[j].avatars.large,
          avatars_medium: list[i].casts[j].avatars.medium
        })
        .then(_data => {
          // console.log('_data',_data.dataValues)
        })
        .catch(e => {
          // console.log('error',e)
        });
      }      
    }     
    for(let j=0; j<list[i].directors.length; j++) {
      directorsIdGroup += list[i].directors[j].id + ',';
      tmpPersonCode = await dbFind('person','personId',list[i].directors[j].id);
      console.log('tmpPersonCode >>>>>', tmpPersonCode, list[i].directors[j].name)
      if(tmpPersonCode == 400 && list[i].directors[j].id) {
        await db.person.create({
          personId: list[i].directors[j].id || '',
          name: list[i].directors[j].name,
          type: 'director',
          avatars_small: list[i].directors[j].avatars.small || '',
          avatars_large: list[i].directors[j].avatars.large || '',
          avatars_medium: list[i].directors[j].avatars.medium || ''
        })
        .then(_data => {
          // console.log('_data',_data.dataValues)
        })
        .catch(e => {
          // console.log('error',e)
        });
      }      
    }
    for(let j=0; j<list[i].genres.length; j++) {
      genresGroup += list[i].genres[j] + ',';
    }
    
    tmpMovieCode = await dbFind('in_theater','movieId',list[i].id);
    console.log('tmpMovieCode in_theater >>>>', tmpMovieCode, list[i].title)
    if(tmpMovieCode == 400) {
      await db.in_theater.create({
        movieId: list[i].id,
        title: list[i].title,
        castsStr: castsIdGroup,
        directorsStr: directorsIdGroup
      })
      .then(_data => {
      })
      .catch(e => {
        // console.log('error',e)
      });
    }
    tmpMovieCode = await dbFind('subjects','movieId',list[i].id);
    console.log('tmpMovieCode subjects~~~~~~~~~~~~~~~', tmpMovieCode, list[i].title)
    if(tmpMovieCode == 400) {
      await db.subjects.create({
        movieId: list[i].id,
        title: list[i].title,
        casts: castsIdGroup,
        directors: directorsIdGroup,
        original_title: list[i].original_title,
        year: list[i].year,
        genres: genresGroup,
        rating_average: list[i].rating.average,
        images_small: list[i].images.small,
        images_large: list[i].images.large,
        images_medium: list[i].images.medium,
        castsStr: castsIdGroup,
        directorsStr: directorsIdGroup
      })
      .then(_data => {
        fn();
      })
      .catch(e => {
        // console.log('error',e)
      });
    } else {
      fn();
    }
  } 

  function fn() {
    ++count;
    if(count == list.length) {
      ctx.body = 200;
    }
  } 
});

router.post('/v2/movie/in_theater', async (ctx, next) => {
  let paramO = ctx.request.body.params;
  let inTheaterList = [];
  let test = 0;
  console.log(paramO)
  let findList =  () => {
    return new Promise(resolve => {
      db.in_theater.findAll({
        attributes: ['id', 'movieId', 'title', 'castsStr', 'directorsStr'],
        limit: paramO.count || 10,
        offset: paramO.start || 0
        }).then(_data => {   
          // console.log(_data)
          
          handle(_data, function(list) {
            resolve(list);
          });
        }).catch(reject => {
          console.log(reject);
        });
        
    });
  }

  let curList = await findList();
  ctx.body = {
    code: 200,
    subjects: curList
  }
});

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
    // tmpO.images = {
    //   small: _data[i].images.small,
    //   large: _data[i].images.large,
    //   medium: _data[i].images.medium,
    // }
    console.log('_data[i].images.small',_data[i])
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

const dbFindSubject = (dbName, keyName, keyV)=> {
  let o = {};
  let obj ={};
  obj.genres = [];
  obj.images = {};
  o[keyName] = keyV;
  return new Promise(resolve => {
    db[dbName].findAll({
      attributes: ['original_title', 'year', 'rating_average', 'genres', 'images_small', 'images_large', 'images_medium'],
      where: o
      }).then(_data => {
        // console.log('dbFindPerson _data',_data)
        if(_data.length) {
          obj.original_title = _data[0].dataValues.original_title;
          obj.year = _data[0].dataValues.year;
          obj.genres = _data[0].dataValues.genres.split(',');
          obj.rating.average = _data[0].dataValues.rating_average;
          obj.images.small = _data[0].dataValues.images_small;
          obj.images.large = _data[0].dataValues.images_large;
          obj.images.medium = _data[0].dataValues.images_medium;
          resolve(obj);
        } else {
          resolve(400)
        }
      }).catch(reject => {
        resolve(500);
      });   
  })
};


app.use(router.routes());
app.listen(3000);
console.log('start 3000');