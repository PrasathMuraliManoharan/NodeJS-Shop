exports.getLogin = (req, res, next) => {
    console.log(req.get('Cookie'))
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
    });
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
};
exports.postLogout = (req, res, next) => {
    req.session.destory(() => {
        res.redirect('/');
    })
};
