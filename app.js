const express = require('express');
const path = require('path');
const fs = require('fs');
const { name } = require('commander');
const connect = require('./Config/connect');
const Register = require('./Moduls/register');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        expires: Date.now() + 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}))
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Register.authenticate()));

passport.serializeUser(Register.serializeUser());
passport.deserializeUser(Register.deserializeUser());


app.use((req, res, next) => {
    res.locals.userNotFound = req.flash('userNotFound');
    res.locals.invalidPass = req.flash('invalidPass');
    res.locals.message = req.flash('loginScc');
    res.locals.passwordMatch = req.flash('passwordMatch');
    res.locals.emailExist = req.flash('emailExist');
    res.locals.success = req.flash("success");
    next();
})

// app.get("/detele", (req,res) => {
//     let data = Register.deleteMany({})
//     .then((data) => {
//         res.send(data);
//     })
//     .catch((err) => {
//         res.send(err);
//     })
// })
// app.get("/count", (req,res) => {

//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }

//     res.send(`Count: ${req.session.count}`);
// })

// app.get('/deleteData', async (req, res) => {
//     let data = await Register.deleteMany({});
//     res.send(data);
// })

app.get('/', (req, res) => {

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear()).slice(-2);

    const formattedDate = `${day}-${month}-${year}`;



    fs.readdir('./Files', 'utf8', (err, file) => {
        if (err) return res.status(500).send('Something went wrong');
        res.render('index', { files: file, date: formattedDate, ...res.locals });
    });

})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/loginUser', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    async (req, res) => {
        const { email, password } = req.body;
        req.flash('loginScc', 'Login Successfully');
        res.redirect('/');
    });

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/registerUser', async (req, res) => {

    try {
        const { fullName, username, password, confirmPassword } = req.body;
        if (password != confirmPassword) {
            req.flash('passwordMatch', 'Password does not match');
            res.render('register', { passwordMatch: req.flash('passwordMatch') });
        }
        
        const user = new Register({
            fullName,
            username
        });
        await Register.register(user, password); // it will take the two argument UserModel and password
        req.flash('success', 'You are registered successfully');
        res.render('login', { success: req.flash('success') });
    } catch (err) {
        req.flash('emailExist', err.message);
        res.render('register', { emailExist: req.flash('emailExist') });
    }







})



app.get('/temsCondition.ejs', (req, res) => {
    res.render('temsCondition');
});

app.get('/forgotPass', (req, res) => {
    res.render('forgotPass');
})

app.get('/create', (req, res) => {
    res.render('create');
})

app.post('/addHisab', (req, res) => {
    const { name, description } = req.body;

    fs.writeFile(`./Files/${name}.txt`, description, (err) => {
        if (err) return res.status(500).send('Something went wrong');
        res.redirect('/');

    });
});

app.get('/edit/:name', (req, res) => {
    const { name } = req.params;

    fs.readFile(`./Files/${name}`, 'utf8', (err, data) => {
        if (err) return res.status(500).send("Something went wrong");
        res.render('edit', { name, description: data });
    })

})

app.post('/saveChanges/:name', (req, res) => {

    const { name } = req.params;
    const { data } = req.body;

    fs.writeFile(`./Files/${name}`, data, (err) => {
        if (err) return res.status(500).send("Something went wrong");
        res.redirect('/');
    })
});

app.get(`/delete/:name`, (req, res) => {
    const { name } = req.params;

    fs.unlink(`./Files/${name}`, (err) => {
        if (err) return res.status(500).send("Something went wrong");
        res.redirect('/');
    })
})

app.get(`/view/:name`, (req, res) => {

    const { name } = req.params;

    fs.readFile(`./Files/${name}`, 'utf8', (err, data) => {
        if (err) return res.status(500).send("Something went wrong");
        res.render('hisab', { name, description: data });
    })

})

app.get('/edit/:name', (req, res) => {
    const { name } = req.params;

    fs.readFile(`./Files/${name}`, 'utf8', (err, data) => {
        if (err) return res.status(500).send("Something went wrong");
        res.render('edit', { name, description: data });
    })

})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
})