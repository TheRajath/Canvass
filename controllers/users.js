const User = require('../models/user');
const Campground = require('../models/campground');

module.exports.renderRegister = (req, res) => {

    res.render('users/register');
};

module.exports.register = async (req, res) => {

    try {

        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.logout(registeredUser, err => {

            if (err) return next(err);

            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });

    } catch (e) {

        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {

    res.render('users/login');
};

module.exports.login = (req, res) => {

    req.flash('success', 'welcome back!');

    const redirectUrl = req.session.returnTo || '/campgrounds';

    delete req.session.returnTo;

    res.redirect(redirectUrl);
};

module.exports.showUser = async (req, res) => {

    const user = req.user;
    const campgroundCount = await Campground.find({ author: { $in : user._id }}).count();

    res.render('users/show', { user, campgroundCount });
};

module.exports.logout = (req, res, next) => {

    req.logout(err => {
        if (err) return next(err);

        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};
