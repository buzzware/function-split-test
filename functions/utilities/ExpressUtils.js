const { wrap } = require('@awaitjs/express');

const ExpressUtils = class  {

	static jsonEndpoint(expressApp, firebase, aPath, aVerb, aHandler) {
		expressApp[aVerb.toLowerCase()](aPath, wrap(async function (req, res) {
			try {
				let output = await aHandler(req);

				if (output)
					res.status(200).json(output);
				else {
					res.status(204).type('json').end();
				}
			} catch (e) {
				res.status(e.statusCode || 500).json({error: e.message});
			}
		}));
	}

};

module.exports = ExpressUtils;
