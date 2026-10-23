
import express from "express";
import session from "express-session";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

// COMMIT 9 — Configuração da aplicação Express

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

// COMMIT 11 — Redirecionamento inicial

app.get("/", (req, res) => {
    res.redirect("/login");
});

// COMMIT 12 — Rota de login

app.get("/login", (req, res) => {
    res.sendFile("login.html", {
        root: "src/views/auth"
    });
});

// COMMIT 13 — Rota de cadastro

app.get("/register", (req, res) => {
    res.sendFile("register.html", {
        root: "src/views/auth"
    });
});

// COMMIT 14 — Rota do dashboard

app.get("/dashboard", (req, res) => {
    res.sendFile("index.html", {
        root: "src/views/dashboard"
    });
});

// COMMIT 15 — Rota de reclamações

app.get("/complaints", (req, res) => {
    res.sendFile("index.html", {
        root: "src/views/complaints"
    });
});

// COMMIT 16 — Rota de criação de reclamação

app.get("/complaints/create", (req, res) => {
    res.sendFile("create.html", {
        root: "src/views/complaints"
    });
});

// COMMIT 17 — Rota de detalhes da reclamação

app.get("/complaints/details", (req, res) => {
    res.sendFile("details.html", {
        root: "src/views/complaints"
    });
});

// COMMIT 18 — Integração das rotas de autenticação

app.use(authRoutes);

// COMMIT 19 — Integração das rotas de reclamações

app.use(complaintRoutes);

// COMMIT 20 — Integração das rotas de usuários

app.use(userRoutes);

// COMMIT 23 — Tratamento de erros

app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(err);

        if (res.headersSent) {
            next(err);
            return;
        }

        res.status(500).send("Erro interno do servidor.");
    }
);

// COMMIT 24 — Página 404
// Deve ficar depois de todas as rotas.

app.use((req, res) => {
    res.status(404).send("Página não encontrada.");
});

// Exportação da aplicação

export default app;
