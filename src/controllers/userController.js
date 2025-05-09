const mysql = require('mysql2/promise');
const { consultarCorenPorCPF } = require('../services/userServices.js'); // <- Vamos importar aqui!

const client = mysql.createPool(process.env.CONNECTION_STRING);

// Cadastro de usuário
async function registerUser(req, res) {
    const { nome, cpf, email, senha, crm, tipo_user } = req.body;

    try {
        // Verifica se o email já existe
        const [emailCheck] = await client.query("SELECT * FROM users WHERE email = ?", [email]);
        if (emailCheck.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        // Verifica se o CPF já existe
        const [cpfCheck] = await client.query("SELECT * FROM users WHERE cpf = ?", [cpf]);
        if (cpfCheck.length > 0) {
            return res.status(400).json({ error: 'CPF já cadastrado.' });
        }

        // Se tipo_user for 2 (enfermeiro), consulta no Cofen
        // if (tipo_user == 2) {
        //     const resultado = await consultarCorenPorCPF(cpf);

        //     if (!resultado) {
        //         return res.status(400).json({ error: 'CPF não encontrado no sistema Coren.' });
        //     }
        // }

        // Se tudo estiver certo, realiza o cadastro do usuário
        await client.query(
            "INSERT INTO users (nome, email, senha, cpf, crm, tipo_user) VALUES (?, ?, ?, ?, ?, ?)",
            [nome, email, senha, cpf, crm, tipo_user]
        );

        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
}

// Login de usuário
async function loginUser(req, res) {
    const { email, senha } = req.body;

    try {
        const [result] = await client.query("SELECT * FROM users WHERE email = ?", [email]);

        if (result.length === 0) {
            return res.status(400).json({ error: 'Usuário não encontrado.' });
        }

        const user = result[0];

        if (user.senha !== senha) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            usuario: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao tentar fazer login.' });
    }
}

module.exports = {
    registerUser,
    loginUser
};
