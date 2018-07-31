var Sequelize = require('sequelize');
const Op = Sequelize.Op;


let sequelize = new Sequelize(
    'mytest',
    'root',
    '123456', 
    {
        dialect: 'mysql',
        host: 'localhost',
        port: '3306',
    }
  );

let user = sequelize.define('user', {
        name: {
          type: Sequelize.STRING,
          unique: true
        },
        age: Sequelize.SMALLINT,
        sex: Sequelize.STRING
    }, {
        freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步      
        tableName: 'user', // 数据库表名   
        timestamps: false, // 是否自动添加时间戳createAt，updateAt    
        // underscored: true                // 字段以下划线（_）来分割（默认是驼峰命名风格）
    });

// 多对多 学生、课程、sc关系表
let course = sequelize.define('course', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    sname: Sequelize.STRING,
    teacher: Sequelize.STRING,
    credit: Sequelize.FLOAT
}, {
    freezeTableName: true,
    tableName: 'sc_course',
    timestamps: false
});

let student = sequelize.define('student', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    sname: Sequelize.STRING,
    age: Sequelize.SMALLINT,
    sex: Sequelize.STRING,
    class: Sequelize.STRING
}, {
    freezeTableName: true,
    tableName: 'sc_student',
    timestamps: false
});

let sc = sequelize.define('sc', {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    cid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
}, {
    freezeTableName: true,
    tableName: 'sc_sc',
    timestamps: false
});

student.belongsToMany(course, { as: 'selected_class', through: sc, foreignKey: 'sid' })
course.belongsToMany(student, { through: sc, foreignKey: 'cid' })

// 一对多 人、汽车
let human = sequelize.define('human', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    sname: Sequelize.STRING,
    age: Sequelize.SMALLINT,
    sex: Sequelize.STRING,
}, {
    freezeTableName: true,
    tableName: 'hc_human',
    timestamps: false
});

let car = sequelize.define('car', {
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
}, {
    freezeTableName: true,
    tableName: 'hc_car',
    timestamps: false,
    underscored: true
});

module.exports = {
    sequelize,
    Op,
    user: user,
    sc: sc,
    student: student,
    course: course,
    human: human,
    car: car,
}