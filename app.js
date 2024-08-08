const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(helmet());

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/profile', isAuthenticated, (req, res) => {
    const { name, email, address, pincode } = req.session.user;
    res.render('profile', { name, email, address, pincode });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/profile');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.post('/login', (req, res) => {
    const { name, email, address, pincode } = req.body;
    req.session.user = { name, email, address, pincode };
    res.redirect('/profile');
});

app.set('view engine', 'ejs');

module.exports = app;
