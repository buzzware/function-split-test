module.exports = class MyService {

	// static setup(feathersExpressApp) {
	//
	// }

	setup(app, path) {
		//feathersExpressApp.service('hello')
		// this.hooks({
		// 	before: {
		// 		all: [
		// 			(context) => {
		// 				console.log(context);
		// 			}
		// 		]
		// 	}
		// });
	}

	async find(params) {
		console.log('feathers/hello find');
		return [];
	}

	async get(id, params) {
		console.log('/hello get');
		return {message: 'hi from feathers'};
	}

	async create(data, params) {

	}

	async update(id, data, params) {

	}

	async patch(id, data, params) {

	}

	async remove(id, params) {

	}

};
