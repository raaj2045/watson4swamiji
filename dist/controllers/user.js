'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
exports.postLogin = function (req, res) {
    req.assert('username', 'Username cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(401).json({
            error: 'There was an error logging in.',
            authenticated: false
        });
    }
    passport.authenticate('local', function (err, user) {
        if (err) {
            return res.status(401).json({
                error: "There was an error authenticating: " + err,
                authenticated: false
            });
        }
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials. Please try again.',
                authenticated: false
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(401).json({
                    error: "There was an error authenticating: " + err,
                    authenticated: false
                });
            }
            var returnTo = req.session.returnTo || '/';
            delete req.session.returnTo;
            return res.status(200).json({
                user: req.user,
                authenticated: true,
                returnTo: returnTo
            });
        });
        return null;
    })(req, res);
    return null;
};
exports.getUser = function (req, res) {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            user: req.user,
            authenticated: true
        });
    }
    else {
        return res.status(401).json({
            error: 'User is not authenticated',
            authenticated: false
        });
    }
};
exports.postLogout = function (req, res) {
    req.logout();
    res.status(200).send('OK');
};
//# sourceMappingURL=user.js.map