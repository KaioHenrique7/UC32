import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";

export class AuthService {

    static async register(
        name: string,
        email: string,
        password: string
    ) {
        if (!name || !email || !password) {
            throw new Error(
                "Todos os campos são obrigatórios."
            );
        }
    
        const existingUser =
            await UserModel.findByEmail(email);
    
        if (existingUser) {
            throw new Error("E-mail já cadastrado.");
        }
    
        const hashedPassword =
            await bcrypt.hash(password, 10);
    
        const userId = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });
    
        return userId;
    }
    

    static async login(
        email: string,
        password: string
    ) {
        const user =
            await UserModel.findByEmail(email);

        if (!user) {
            throw new Error("E-mail ou senha inválidos.");
        }

        const passwordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordCorrect) {
            throw new Error("E-mail ou senha inválidos.");
        }

        return user;
    }
}
