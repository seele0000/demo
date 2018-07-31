const db = require('./db');

function insert() {
	db.user.create({
		name: 'Jerry',
		age: '15',
		sex: 'male'
	}).then(_data => {
		console.log('_data',_data.dataValues);
	}).catch(e => {
		console.log('error',e)
	});
}

function destroy() {
	db.user.destroy({
    	where: {
    		name: 'Jerry'
    	}
    }).then(_data => {
    	console.log('_data',_data);
    }).catch(e => {
		console.log('error',e)
	});
}

function update() {
	db.user.update({
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
}

function find() {
	db.student.findAll({
			attributes: ['sname', 'class'],
    		where: {
    	        sname: '王军'
    	    }
    	}).then(_data => { 
    		var list = [];
    		for (let i = 0; i < _data.length; i++) {
	            list.push(_data[i].dataValues)
	        }
    		console.log('_data',list);
    	})
}

function find1toN() {
	db.human.findAll({
            'include': {
                model: db.car,
                association: db.human.hasMany(db.car, {foreignKey: 'human_id'}),
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
}

function findNtoN() {
	db.student.all ({ 
		where: { 
			id: 's0001' 
		},
		include: [{
			model: db.course,
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
}

findNtoN();
