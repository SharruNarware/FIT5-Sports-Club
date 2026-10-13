const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const path = require("path");


require("dotenv").config();
connectDB();


app.engine("ejs", engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    "/vendor/swiper",
    express.static(path.join(__dirname, "node_modules/swiper"))
);



// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL
  })
}));



app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();
});



//routes:)
app.use('/home', require('./routes/homeRoutes'));

app.use('/home/blogs', require('./routes/blogRoutes'));

app.use("/home/programs", require('./routes/programsRoutes'));

app.use("/home/contact", require('./routes/contactRoutes'));

app.use("/home/about", require("./routes/aboutRoutes"));

app.use("/home/camps", require("./routes/campsRoutes"));

app.use("/home/initiatives", require("./routes/initiativesRoutes"));

app.use("/home/legal", require("./routes/legalRoutes"));


//admin routes :)
app.use("/admin", require("./routes/adminRoutes"));






//port :)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});