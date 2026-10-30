import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import userRoutes from "./routes/userRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();

const publicPath = path.resolve(process.cwd(), "public");
const viewsPath = path.resolve(process.cwd(), "src/views");

// Permite receber JSON nas requisições
app.use(express.json());

// Permite receber dados enviados por formulários HTML
app.use(
    express.urlencoded({
        extended: true
    })
);

// Disponibiliza CSS, JavaScript e imagens da pasta public
app.use(express.static(publicPath));

// Configuração das sessões
app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "uc32_secret_2026",

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        }
    })
);

// Página inicial
app.get("/", (_req, res) => {
    res.redirect("/login");
});

// Página de login
app.get("/login", (_req, res) => {
    res.sendFile(
        path.join(
            viewsPath,
            "auth",
            "login.html"
        )
    );
});

// Página de cadastro
app.get("/register", (_req, res) => {
    res.sendFile(
        path.join(
            viewsPath,
            "auth",
            "register.html"
        )
    );
});

// Dashboard protegido
app.get(
    "/dashboard",
    authMiddleware,
    (_req, res) => {
        res.sendFile(
            path.join(
                viewsPath,
                "dashboard",
                "index.html"
            )
        );
    }
);

// Página de listagem de reclamações protegida
app.get(
    "/complaints",
    authMiddleware,
    (_req, res) => {
        res.sendFile(
            path.join(
                viewsPath,
                "complaints",
                "index.html"
            )
        );
    }
);

// Página para criar reclamação protegida
app.get(
    "/complaints/create",
    authMiddleware,
    (_req, res) => {
        res.sendFile(
            path.join(
                viewsPath,
                "complaints",
                "create.html"
            )
        );
    }
);

// Página de detalhes da reclamação protegida
app.get(
    "/complaints/details/:id",
    authMiddleware,
    (_req, res) => {
        res.sendFile(
            path.join(
                viewsPath,
                "complaints",
                "details.html"
            )
        );
    }
);

// Rotas da API de autenticação
app.use(
    "/api/auth",
    authRoutes
);

// Rotas da API de usuários
app.use(
    "/api/users",
    userRoutes
);

// Rotas da API de reclamações
app.use(
    "/api/complaints",
    complaintRoutes
);

// Tratamento global de erros
app.use(
    (
        error: Error,
        _req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(error);

        if (res.headersSent) {
            return next(error);
        }

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
);

// Rota para páginas inexistentes
app.use(
    (_req, res) => {
        return res.status(404).send(
            "Página não encontrada."
        );
    }
);

export default app;
