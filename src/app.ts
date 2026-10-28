
import express from "express";
import session from "express-session";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

// Configuração da aplicação
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos da pasta public
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

// Página de login
app.get("/login", (req, res) => {
    res.sendFile("login.html", {
        root: "src/views/auth"
    });
});

// Página de cadastro
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

// Lista de reclamações
app.get("/complaints", (req, res) => {
    res.sendFile("index.html", {
        root: "src/views/complaints"
    });
});

// Formulário de nova reclamação
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

// Rotas de autenticação
app.use(authRoutes);

// Rotas de reclamações
app.use(complaintRoutes);

// Rotas de usuários
app.use(userRoutes);

// Tratamento de erros
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(err);

        if (res.headersSent) {
            return next(err);
        }

        return res.status(500).send("Erro interno do servidor.");
    }
);

// Página não encontrada (404)
app.use((req, res) => {
    res.status(404).send("Página não encontrada.");
});

export default app;
