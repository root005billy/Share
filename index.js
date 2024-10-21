const express = require('express');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const route = require('./routes/route');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'email' }));
app.use(flash());

// Middleware to parse and pass cookies to route.js
app.use((req, res, next) => {
    req.cookies = req.cookies || {}; // Ensure req.cookies is always defined
    const cookies = req.headers.cookie;
    if (cookies) {
        const cookiesArray = cookies.split('; ');
        cookiesArray.forEach(cookie => {
            const [key, value] = cookie.split('=');
            req.cookies[key] = value;
        });
    }
    next();
});

app.use('/', route);

app.listen(port, () => {
    console.log(`Node server is running on port ${port}`);
});
