const port = 1337;

var captchapng = require('captchapng'),
 express = require('express'),
app = express(),
bodyParser = require('body-parser');

module.exports = (function(){
	function letsdoit(){
		this.start = function(letsgo){
			app.use(bodyParser());
			app.use(express.static(__dirname+'/public'));
			app.get('/captcha', function(req, res) {
				res.sendFile(__dirname + '/public/public.html');
			});
			var hoh;
			function capture (req, res) {
				hoh = parseInt(Math.random()*9000 + 1000);
				if(req.url == '/captcha.png') {
					var p = new captchapng(80,30, hoh); 
					p.color(0, 0, 0, 0); 
					p.color(80, 80, 80, 255); 
 
					var img = p.getBase64();
					var imgbase64 = new Buffer(img,'base64');
					res.writeHead(200, {
						'Content-Type': 'image/png'
					});
					res.end(imgbase64);
				} else {
					res.end('');
				}
			}
			app.get('/captcha.png', capture);
			
			app.post('/captcha', function(req, res){
				var non = req.body.src;
				if(non == hoh) {
					res.json({'answ' : 'O MY GOD!'});
				   }else{
					res.json({'answ' : 'U A WRONG!'});
				}
			});
			app.listen(process.env.port||port,()=>console.log('> Port %d listening!', port));
		};
	}
	return new letsdoit;
})();