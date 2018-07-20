let Sequelize = require('sequelize');
let mySqlConfig = {
	'host': 'localhost',    // 主机名
	'port': '3306',         // 端口号，MySQL默认3306
	'database': 'movie',   // 使用哪个数据库
	'user': 'root',         // 用户名
	'password': '123456',   // 口令	
	'options': {
	    operatorsAliases: false
	}
};
let sequelize = new Sequelize(
    mySqlConfig.database,
    mySqlConfig.user,
    mySqlConfig.password, {
        dialect: 'mysql',
        host: mySqlConfig.host,
        port: mySqlConfig.port
	},
	
);

let message = sequelize.define('message',{
  id: {
    type: Sequelize.SMALLINT,
    primaryKey: true
  },
	movieId: Sequelize.INTEGER,
	title: Sequelize.STRING,
  msg: Sequelize.STRING,
  name: Sequelize.STRING,
  time: Sequelize.STRING
  },{      
    freezeTableName: true,      // 默认false修改表名为复数，true不修改表名，与数据库表名同步      
    tableName: 'message',       // 数据库表名   
    timestamps: false,          // 是否自动添加时间戳createAt，updateAt    
    underscored: true           // 字段以下划线（_）来分割（默认是驼峰命名风格）
});

let user = sequelize.define('user',{
  id: {
    type: Sequelize.SMALLINT,
    primaryKey: true
  },
	name: Sequelize.STRING,
  password: Sequelize.STRING
  },{      
    freezeTableName: true,      // 默认false修改表名为复数，true不修改表名，与数据库表名同步      
    tableName: 'user',       // 数据库表名   
    timestamps: false,          // 是否自动添加时间戳createAt，updateAt    
    underscored: true           // 字段以下划线（_）来分割（默认是驼峰命名风格）
});

let in_theater = sequelize.define('in_theater',{
  id: {
    type: Sequelize.SMALLINT,
    primaryKey: true
  },
  movieId: Sequelize.STRING,
  title: Sequelize.STRING,
  castsStr: Sequelize.STRING,
  directorsStr: Sequelize.STRING
  },{      
    freezeTableName: true,      // 默认false修改表名为复数，true不修改表名，与数据库表名同步      
    tableName: 'in_theaters_list',       // 数据库表名   
    timestamps: false,          // 是否自动添加时间戳createAt，updateAt    
    underscored: true           // 字段以下划线（_）来分割（默认是驼峰命名风格）
});

let person = sequelize.define('person',{
  id: {
    type: Sequelize.SMALLINT,
    primaryKey: true
  },
  personId: Sequelize.STRING,
  name: Sequelize.STRING,
  type: Sequelize.STRING,
  avatars_small: Sequelize.STRING,
  avatars_large: Sequelize.STRING,
  avatars_medium: Sequelize.STRING,
  },{      
    freezeTableName: true,      // 默认false修改表名为复数，true不修改表名，与数据库表名同步      
    tableName: 'person',       // 数据库表名   
    timestamps: false,          // 是否自动添加时间戳createAt，updateAt    
    underscored: true           // 字段以下划线（_）来分割（默认是驼峰命名风格）
});

let subjects = sequelize.define('subjects',{
  id: {
    type: Sequelize.SMALLINT,
    primaryKey: true
  },
  movieId: Sequelize.STRING,
  title: Sequelize.STRING,
  original_title: Sequelize.STRING,
  year: Sequelize.STRING,
  genres: Sequelize.STRING,
  rating_average: Sequelize.FLOAT,
  images_small: Sequelize.STRING,
  images_large: Sequelize.STRING,
  images_medium: Sequelize.STRING,
  castsStr: Sequelize.STRING,
  directorsStr: Sequelize.STRING
  },{      
    freezeTableName: true,      // 默认false修改表名为复数，true不修改表名，与数据库表名同步      
    tableName: 'subjects',       // 数据库表名   
    timestamps: false,          // 是否自动添加时间戳createAt，updateAt    
    underscored: true           // 字段以下划线（_）来分割（默认是驼峰命名风格）
});

module.exports = {
  message : message,
  in_theater: in_theater,
  user: user,
  person: person,
  subjects: subjects
}