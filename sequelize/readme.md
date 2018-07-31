[TOC]
# ORM
> 中文文档：https://github.com/demopark/sequelize-docs-Zh-CN  
英文文档：http://docs.sequelizejs.com/

1. 对象关系映射（Object-Relational Mapping）
2. 从效果上说，它其实是创建了一个可在编程语言里使用的--“虚拟对象数据库”。
3. 因为Sequelize返回的对象是Promise，所以我们可以用then()和catch()分别异步响应成功和失败。
```
mysql> select * from pets;
+----+--------+------------+
| id | name   | birth      |
+----+--------+------------+
|  1 | Gaffey | 2007-07-07 |
|  2 | Odie   | 2008-08-08 |
+----+--------+------------+
2 rows in set (0.00 sec)
```
用对象表示
```
{
    "id": 1,
    "name": "Gaffey",
    "birth": "2007-07-07"
}
```
# 建立连接
```
let sequelize = new Sequelize('database', 'username', 'password', {
        dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
        host: 'localhost',
	    port: '3306',
	    pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
```
# 定义模型
e.g
```
let student = sequelize.define('student',{
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    sname: Sequelize.STRING,
    age: Sequelize.SMALLINT,
    sex: Sequelize.STRING,
    class: Sequelize.STRING
},{      
    freezeTableName: true,          // 默认false修改表名为复数，true不修改表名，与数据库表名同步      
    tableName: 'user_selfinfo',     // 数据库表名   
    timestamps: false,              // 是否自动添加时间戳createAt，updateAt    
    underscored: true               // 字段以下划线（_）来分割（默认是驼峰命名风格）
});
```
## 配置
属性名 | 值 | 说明
-- | -- | --
timestamps | true \| false | 是否添加时间戳属性 (updatedAt, createdAt)
underscored | false \| true | 是否自动设置所有属性的字段选项为下划线命名方式（不覆盖）
freezeTableName | false \| true | 是否禁用修改表名（默认将模型转为复数）
tableName | String | 自定义表明
时间戳处理

```
const Foo = sequelize.define('foo',  { /* bla */ }, {
  // 不要忘记启用时间戳！
  timestamps: true,

  // 我不想要 createdAt
  createdAt: false,

  // 我想 updateAt 实际上被称为 updateTimestamp
  updatedAt: 'updateTimestamp',

  // 并且希望 deletedA t被称为 destroyTime（请记住启用paranoid以使其工作）
  deletedAt: 'destroyTime',
  paranoid: true
})
```

## 字段属性设置
> 设置对应字段属性时，需在数据库中先进行设置，在定义模型时进行映射

属性名 | 值 | 说明
-- | -- | --
type | 数据类型 | 指定该字段的数据类型
primaryKey | false \| true | 是否设为主键
allowNull | true \| false | 是否允许为空
autoIncrement | false \| true | 是否设置为自增列
defaultValue | String \| Boolean \| Date ... | 默认值
unique | true \| false \| String | 唯一约束
field | String | 别名
references | Object | 设置外键
- | model | 另一个模型
- | key | 引用模型的列名称
validate | Object | 验证

## 数据类型（MySQL）
类型 | 长度 | 值 | 描述 | 使用
-- | -- | -- | -- | -- 
STRING | 255 | [integer] | 可变长度字符串 | Sequelize.STRING<br>Sequelize.STRING(10)
CHAR | 255 | [integer] | 固定长度字符串 | Sequelize.CHAR<br>Sequelize.CHAR(10)
TEXT | - | [string] tiny \| medium \| long | 字符型
TINYINT | 8 | [integer] | 整型
SMALLINT | 16 | [integer] | 整型
MEDIUMINT | 24 | [integer] | 整型
INTEGER | 32/255 | [integer] | 整型
BIGINT | 64 | [integer] | 整型,可能被当做字符串处理
FLOAT | - | (length, decimals) | 近似数值型,4字节精度
REAL | - | (length, decimals) | 近似数值型,4字节精度
DOUBLE | - | (length, decimals) | 近似数值型,8字节精度
DECIMAL | - | (precision, integer) | 精确数值型
BOOLEAN | - | [boolean / tinyint] | 布尔值
BLOB | - | [string] tiny \| medium \| long | 二进制存储器
ENUM | - | (string[]) | 枚举 | DataTypes.ENUM('value', 'another value').
DATE | - | [integer] | 日期时间型
DATEONLY | - | - | A date only column (no timestamp)
TIME | - | - | A time column
NOW | - | - | A default value of the current timestamp

## 验证
> 验证会自动运行在 create ， update 和 save 上。 你也可以调用 validate() 手动验证一个实例。

1. 验证规则
    ```
    validate: {
      is: ["^[a-z]+$",'i'],     // 只允许字母
      is: /^[a-z]+$/i,          // 与上一个示例相同,使用了真正的正则表达式
      not: ["[a-z]",'i'],       // 不允许字母
      isEmail: true,            // 检查邮件格式 (foo@bar.com)
      isUrl: true,              // 检查连接格式 (http://foo.com)
      isIP: true,               // 检查 IPv4 (129.89.23.1) 或 IPv6 格式
      isIPv4: true,             // 检查 IPv4 (129.89.23.1) 格式
      isIPv6: true,             // 检查 IPv6 格式
      isAlpha: true,            // 只允许字母
      isAlphanumeric: true,     // 只允许使用字母数字
      isNumeric: true,          // 只允许数字
      isInt: true,              // 检查是否为有效整数
      isFloat: true,            // 检查是否为有效浮点数
      isDecimal: true,          // 检查是否为任意数字
      isLowercase: true,        // 检查是否为小写
      isUppercase: true,        // 检查是否为大写
      notNull: true,            // 不允许为空
      isNull: true,             // 只允许为空
      notEmpty: true,           // 不允许空字符串
      equals: 'specific value', // 只允许一个特定值
      contains: 'foo',          // 检查是否包含特定的子字符串
      notIn: [['foo', 'bar']],  // 检查是否值不是其中之一
      isIn: [['foo', 'bar']],   // 检查是否值是其中之一
      notContains: 'bar',       // 不允许包含特定的子字符串
      len: [2,10],              // 只允许长度在2到10之间的值
      isUUID: 4,                // 只允许uuids
      isDate: true,             // 只允许日期字符串
      isAfter: "2011-11-05",    // 只允许在特定日期之后的日期字符串
      isBefore: "2011-11-05",   // 只允许在特定日期之前的日期字符串
      max: 23,                  // 只允许值 <= 23
      min: 23,                  // 只允许值 >= 23
      isCreditCard: true,       // 检查有效的信用卡号码
    
      // 也可以自定义验证:
      isEven(value) {
        if (parseInt(value) % 2 != 0) {
          throw new Error('Only even values are allowed!')
          // 我们也在模型的上下文中，所以如果它存在的话, 
          // this.otherField会得到otherField的值。
        }
      }
    }
    ```
2. 验证返回错误信息
    - 单参数
    ```
    isInt: {
      msg: "Must be an integer number of pennies"
    }
    ```
    - 多参数（且参数为数组）
    ```
    isIn: {
      args: [['en', 'zh']],
      msg: "Must be English or Chinese"
    }
    ```
# 增加
```
user.create({
		name: 'Jerry',
		age: '15',
		sex: 'male'
	}).then(_data => {
		console.log('_data',_data.dataValues);
	}).catch(e => {
		console.log('error',e)
	});
```
# 删除
```
user.destroy({
    	where: {
    		name: 'Jerry'
    	}
    }).then(_data => {
    	console.log('_data',_data);
    }).catch(e => {
		console.log('error',e)
	});
```
# 更新
```
user.update({
        	age: 12
        }, {
    	where: {
    		id: 6
    	}
    }).then(_data => {
    	console.log(_data);
    }).catch(reject => {
    	console.log(reject);
    })
```
# 查询
## 查询条件
### attributes
> 显示指定列

```
db.student.findAll({
		attributes: ['sname', 'class'],
		where: {
	        sname: '王军'
	    }
	}).then(_data => { })
```
=>
```
[ { sname: '王军', class: 'c101' } ]
```
### where
- 特定属性
    ```
    student.findAll({
    		where: {
    	        sname: '王军'
    	    }
    	}).then(_data => { })
    ```
    =>
    ```
    [ { id: 's0001', sname: '王军', age: 20, sex: '1', class: 'c101' } ]
    ```
- 在特定范围内进行搜索
    ```
    student.all({
		where: {
	        sname: ['王军', '刘飞', '杨晓']
	    }
	}).then(_data => { })
    ```
    =>
    ```
    [ { id: 's0001', sname: '王军', age: 20, sex: '1', class: 'c101' },
    { id: 's0003', sname: '刘飞', age: 22, sex: '1', class: 'c102' },
    { id: 's0008', sname: '杨晓', age: 18, sex: '0', class: 'c104' } ]
    ```
- Op 正则查询
    > Op需在开始声明  
    
    ```
    var Sequelize = require('sequelize');  
    var Op = Sequelize.Op;
    ```
    > Op使用方法（MySQL）
    
    使用 | 说明
    -- | --
    [Op.and]: {a: 5} | 且 (a = 5)
    [Op.or]: [{a: 5}, {a: 6}] | (a = 5 或 a = 6)
    [Op.gt]: 6 | id > 6
    [Op.gte]: 6 | id >= 6
    [Op.lt]: 10 | id < 10
    [Op.lte]: 10 | id <= 10
    [Op.ne]: 20 | id != 20
    [Op.between]: [6, 10] | 在 6 和 10 之间
    [Op.notBetween]: [11, 15] | 不在 11 和 15 之间
    [Op.in]: [1, 2] | 在 [1, 2] 之中
    [Op.notIn]: [1, 2] | 不在 [1, 2] 之中
    [Op.like]: '%hat' | 包含 '%hat'
    [Op.notLike]: '%hat' | 不包含 '%hat'
    
    ```
    student.all({
		where: {
	        sname: {
	        	[Op.like]: '张%', 
	        }
	    },
	}).then(_data => { })
    ```
    =>
    ```
    [ { id: 's0002', sname: '张宇', age: 21, sex: '1', class: 'c101' },
    { id: 's0010', sname: '张良', age: 22, sex: '1', class: 'c105' } ]
    ```
### limit
> 限制

```
student.all({
     	limit: 2
	}).then(_data => { })
```
=> 
```
[ { id: 's0001', sname: '王军', age: 20, sex: '1', class: 'c101' },
  { id: 's0002', sname: '张宇', age: 21, sex: '1', class: 'c101' } ]
```
### offset
> 偏移

```
student.all({
	    offset: 5
	}).then(_data => { })
```
=>
```
[ { id: 's0006', sname: '周慧', age: 21, sex: '0', class: 'c104' },
  { id: 's0007', sname: '小红', age: 23, sex: '0', class: 'c104' },
  { id: 's0008', sname: '杨晓', age: 18, sex: '0', class: 'c104' },
  { id: 's0009', sname: '李杰', age: 20, sex: '1', class: 'c105' },
  { id: 's0010', sname: '张良', age: 22, sex: '1', class: 'c105' } ]
```
### group
> 分组排序

```
student.all({
     	group: 'age'
	}).then(_data => { })
```
=>
```
[ { id: 's0004', sname: '赵燕', age: 18, sex: '0', class: 'c103' },
  { id: 's0005', sname: '曾婷', age: 19, sex: '0', class: 'c103' },
  { id: 's0001', sname: '王军', age: 20, sex: '1', class: 'c101' },
  { id: 's0002', sname: '张宇', age: 21, sex: '1', class: 'c101' },
  { id: 's0003', sname: '刘飞', age: 22, sex: '1', class: 'c102' },
  { id: 's0007', sname: '小红', age: 23, sex: '0', class: 'c104' } ]
```
### order
> 指定列排序

```
student.all({
     	order: [['age','DESC']]     // DESC 降序；ACS 升序
	}).then(_data => { })
```
=>
```
[ { id: 's0007', sname: '小红', age: 23, sex: '0', class: 'c104' },
  { id: 's0003', sname: '刘飞', age: 22, sex: '1', class: 'c102' },
  { id: 's0010', sname: '张良', age: 22, sex: '1', class: 'c105' },
  { id: 's0002', sname: '张宇', age: 21, sex: '1', class: 'c101' },
  { id: 's0006', sname: '周慧', age: 21, sex: '0', class: 'c104' },
  { id: 's0001', sname: '王军', age: 20, sex: '1', class: 'c101' },
  { id: 's0009', sname: '李杰', age: 20, sex: '1', class: 'c105' },
  { id: 's0005', sname: '曾婷', age: 19, sex: '0', class: 'c103' },
  { id: 's0004', sname: '赵燕', age: 18, sex: '0', class: 'c103' },
  { id: 's0008', sname: '杨晓', age: 18, sex: '0', class: 'c104' } ]
```
  
## 查询方法
### findAll （同all）
```
student.findAll().then(_data => {		
		var list = []
		for(var i=0; i<_data.length; i++) {
			list.push(_data[i].dataValues)
		}
		console.log(list);
	})
// 或
student.all().then(_data => {		
		var list = []
		for(var i=0; i<_data.length; i++) {
			list.push(_data[i].dataValues)
		}
		console.log(list);
	})
```
=>
```
[ { id: 's0001', sname: '王军', age: 20, sex: '1', class: 'c101' },
  { id: 's0002', sname: '张宇', age: 21, sex: '1', class: 'c101' },
  { id: 's0003', sname: '刘飞', age: 22, sex: '1', class: 'c102' },
  { id: 's0004', sname: '赵燕', age: 18, sex: '0', class: 'c103' },
  { id: 's0005', sname: '曾婷', age: 19, sex: '0', class: 'c103' },
  { id: 's0006', sname: '周慧', age: 21, sex: '0', class: 'c104' },
  { id: 's0007', sname: '小红', age: 23, sex: '0', class: 'c104' },
  { id: 's0008', sname: '杨晓', age: 18, sex: '0', class: 'c104' },
  { id: 's0009', sname: '李杰', age: 20, sex: '1', class: 'c105' },
  { id: 's0010', sname: '张良', age: 22, sex: '1', class: 'c105' } ]
```
### findOne
```
student.findOne().then(_data => {
	console.log(_data.dataValues);
})
```
=>
```
{ id: 's0001', sname: '王军', age: 20, sex: '1', class: 'c101' }
```
### findAndCountAll
> 在数据库中搜索多个元素，返回数据和总计数

```
student.findAndCountAll({
    offset: 2,
 	limit: 2
}).then(_data => {		
	var list = []
	for(var i=0; i<_data.rows.length; i++) {
		list.push(_data.rows[i].dataValues)
	}
	console.log('list', list);
	console.log('count',_data.count);
})
```
=> 
```
list [ 
    { id: 's0003', sname: '刘飞', age: 22, sex: '1', class: 'c102' },
    { id: 's0004', sname: '赵燕', age: 18, sex: '0', class: 'c103' } ]
count 10
```
### count
> 计算数据库中元素的出现次数

- 1
    ```
    student.count ().then(_data => {	
    		console.log('_data',_data)
    	})
    ```
    =>
    ```
    _data 10
    ```
- 2
    ```
    student.count ({
		where: {
	        age: {
	        	[Op.gte]: 20
	        },
	        class: {
	        	[Op.like]: '%4'
	        }
	    },
	}).then(_data => {
		console.log('_data',_data)
	})
    ```
    =>
    ```
    _data 2
    ```
### max / min
> max 获取特定表中特定属性的最大值  
min 获取特定表中特定属性的最小值
- 1
    ```
    student.max ('age').then(_data => {
		console.log('_data',_data)
	})
    ```
    =>
    ```
    _data 23
    ```
- 2
    ```
    student.max ('age', { 
		where: { 
			age: { 
				[Op.lt]: 20 
			} 
		} 
	}).then(_data => {
		console.log('_data',_data)
	})
    ```
    =>
    ```
    _data 19
    ```
## 关联查询(association)
- 1:N
    > 一对多 (每人拥有多辆汽车)

    ```
    let human = sequelize.define('human',{
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        sname: Sequelize.STRING,
        age: Sequelize.SMALLINT,
        sex: Sequelize.STRING,
    },{      
        freezeTableName: true,
        tableName: 'hc_human',
        timestamps: false
    });
    
    let car = sequelize.define('car',{
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        mark: Sequelize.STRING,
        price: Sequelize.FLOAT,
        human_id: {
            type: Sequelize.STRING,
            field: 'human_id',
            unique: true, 
            references: {
                model: 'human',
                key: 'id'
            },
        }
    },{      
        freezeTableName: true,
        tableName: 'hc_car',
        timestamps: false,
        underscored: true
    });
    
    human.findAll({
            'include': {
                model: car,
                association: human.hasMany(car, {foreignKey: 'human_id'}),
                attributes: ['id', 'mark', 'price']
            },
            'where': {
                'id': 'H001'
            }
        }).then(_data => {
            var list = []
    		for(var i=0; i<_data.length; i++) {
    			list.push(_data[i].dataValues);
    		}
    		console.log('list', JSON.stringify(list));
        }).catch(reject => {
            console.log(reject)
        });
    ```
    => 
    ```
    [{
        "id":"H001",
        "sname":"小王",
        "age":27,
        "sex":"1",
        "cars":[{
                "id":"C001",
                "mark":"BMW",
                "price":"65.99"
            },{
                "id":"C003",
                "mark":"Skoda",
                "price":"23.99"
        }]
    }]
    ```
- N:N
> 多对多 (学生、课程、sc关系表)
```
let course = sequelize.define('course',{
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    sname: Sequelize.STRING,
    teacher: Sequelize.STRING,
    credit: Sequelize.FLOAT
},{      
    freezeTableName: true,
    tableName: 'sc_course',
    timestamps: false
});

let student = sequelize.define('student',{
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    sname: Sequelize.STRING,
    age: Sequelize.SMALLINT,
    sex: Sequelize.STRING,
    class: Sequelize.STRING
},{      
    freezeTableName: true,
    tableName: 'sc_student',
    timestamps: false
});

let sc = sequelize.define('sc',{
    sid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    cid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
},{      
    freezeTableName: true,
    tableName: 'sc_sc',
    timestamps: false
});

// 设置关联
student.belongsToMany(course, { as:'selected_class', through: sc, foreignKey: 'sid' })
course.belongsToMany(student, {  through: sc, foreignKey: 'cid' })

// 查询
student.all ({ 
    where: { 
      id: 's0001' 
    },
    include: [{
      model: course,
      attributes: ['sname', 'credit', 'teacher'],
      as: 'selected_class',
      through: {
        attributes: ['sid']
      }
    }]
  }).then(_data => {
    var list = []
    for(var i=0; i<_data.length; i++) {
      list.push(_data[i].dataValues)
    }
    console.log('list', list);
  })
```
=>
```
[{
    "id":"s0001",
    "sname":"王军",
    "age":20,
    "sex":"1",
    "class":"c101",
    "selected_class":[
        {
            "sname":"Java",
            "credit":"3.5",
            "teacher":"李老师",
            "sc":{"sid":"S0001"}
        },{
            "sname":"高等数学",
            "credit":"5.0",
            "teacher":"赵老师",
            "sc":{"sid":"S0001"}
        },{
            "sname":"JavaScript",
            "credit":"3.5",
            "teacher":"王老师",
            "sc":{"sid":"S0001"}
        }
    ]
}]
```