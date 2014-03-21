
/*
 * GET home page.
 */

exports.login = function(req, res){
  res.render('login', { title: 'Express' });
};

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
