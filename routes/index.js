
/*
 * GET app home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

/* Users 'You' Page */
exports.you = function( req, res ) {
	res.render ( 'user/you', {user: req.user} );
}
exports.all = function( req, res ) {
	res.render ( 'user/all', {user: req.user} );
}

