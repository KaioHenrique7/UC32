import express from "express";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "uc32_secret",
        resave: false,
        saveUninitialized: false
    })
    
);
app.get("/", (req, res) => {
    res.redirect("/login");
});
export default app;