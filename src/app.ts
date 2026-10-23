
import express from "express";
import session from "express-session";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

// Configuração de requisições
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// Arquivos estáticos
app.use(express.static("public"));

// Configuração de sessão
app.use(
    session({
        secret: process.env.SESSION_SECRET || "uc32_secret",
        resave: false,
        saveUninitialized: false
    })
);

// Página inicial
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Login
app.get("/login", (req, res) => {
    res.sendFile("login.html", {
        root: "src/views/auth"
    });
});

// Cadastro
app.get("/register", (req, res) => {
    res.sendFile("register.html", {
        root: "src/views/auth"
    });
});

// Dashboard
app.get("/dashboard", (req, res) => {
    res.sendFile("index.html", {
        root: "src/views/dashboard"
    });
});

// Página de reclamações
app.get("/complaints", (req, res) => {
    res.sendFile("index.html", {
        root: "src/views/complaints"
    });
});

// Criar reclamação
app.get("/complaints/create", (req, res) => {
    res.sendFile("create.html", {
        root: "src/views/complaints"
    });
});

// Detalhes da reclamação
app.get("/complaints/details", (req, res) => {
    res.sendFile("details.html", {
        root: "src/views/complaints"
    });
});

// Integração das rotas
app.use(authRoutes);
app.use(complaintRoutes);
app.use(userRoutes);

export default app;
