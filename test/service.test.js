'use strict';

var cp     = require('child_process'),
	should = require('should'),
	service;

describe('Service', function () {
	this.slow(5000);

	after('terminate child process', function (done) {
	    this.timeout(10000);
        setTimeout(() => {
            service.kill('SIGKILL');
            done();
        }, 7000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(service = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			service.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			service.send({
				type: 'ready',
				data: {
					options: {
						geocoding_type: 'Reverse',
						api_key: 'ApY1DQW6gcWPJpXnQZoL8a6q0u-dPmg9oQvn3OZfMDij88z-Z1XUVJQAP9AaXjku'
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#data', function () {
		it('should process the data and send back a result', function (done) {
			var requestId = (new Date()).getTime().toString();

			service.on('message', function (message) {
				if (message.type === 'result') {
					var data = JSON.parse(message.data);
					console.log(data);

					should.equal(data.result.address, '178 Laurel Brook Rd, Middlefield, CT 06455', 'Invalid return data.');

					done();
				}
			});

			service.send({
				type: 'data',
				requestId: requestId,
				data: {
                    lat: 41.5091613,
                    lng: -72.6943264
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});
});