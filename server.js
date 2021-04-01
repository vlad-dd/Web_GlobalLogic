if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { request, response } = require("express");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");



const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

const users = [];

app.get("/", checkAuthenticated, (request, response) => {
  response.render("index.ejs", { name: request.user.name });
});

app.get("/login", (request, response) => {
  response.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", (request, response) => {
  response.render("register.ejs");
});

app.post("/register", async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    users.push({
      id: Date.now().toString().toString(),
      name: request.body.name,
      email: request.body.email,
      password: hashedPassword,
    });
    response.redirect("/login");
  } catch {
    response.redirect("/register");
  }
});

app.post('/addEvent', async (request, response) => {
    const newEvent = new Event(request.body);
    try {
      newEvent.user = request.body;
      const event = await newEvent.save();
      return response.status(200).json({
        ok: true,
        event
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error'
      });
    }
  });

  app.delete('/deleteEvent', async (request, response) => {
      const eventId = request.body.id;
      const uid = request.body;
      try {
        const event = await Event.findById(eventId);
        if (!event) {
          return response.status(404).json({
            ok: false,
            msg: 'Event not found it'
          });
        }
        if (event.user.toString() !== uid) {
          return response.status(401).json({
            ok: false,
            msg: 'Error'
          });
        }
       
      } catch (error) {
        console.log(error);
        return response.status(500).json({
          ok: false,
          msg: 'Error...'
        });
      }
    });



function checkAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  } else {
    response.redirect("/login");
  }
}

app.delete("/logout", (request, response) => {
  request.logOut();
  response.redirect("/login");
});

app.get("/MainCalendar", (request, response) => {
  response.render("MainCalendar.ejs");
});

app.listen(3000);
