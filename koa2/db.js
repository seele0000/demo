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
  msg: Sequelize.STRING
},{      
  freezeTableName: true,      // 默认false修改表名为复数，true不修改表名，与数据库表名同步      
  tableName: 'message',       // 数据库表名   
  timestamps: false,          // 是否自动添加时间戳createAt，updateAt    
  underscored: true           // 字段以下划线（_）来分割（默认是驼峰命名风格）
});

module.exports = {
	message : message
}