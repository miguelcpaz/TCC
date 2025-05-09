const mysql = require("mysql2/promise");

const client = mysql.createPool(process.env.CONNECTION_STRING);

async function postUser(user) {
    const values = [user.nome, user.email, user.senha, user.cpf, user.crm, user.tipo_user];
    await client.query(
        "INSERT INTO users (nome, email, senha, cpf, crm, tipo_user) VALUES (?, ?, ?, ?, ?, ?)", 
        values
    );
}

async function selectUsers() {
    const result = await client.query("SELECT * FROM users");
    return result[0];
}

async function selectUser(id) {
    const result = await client.query("SELECT * FROM users WHERE id = ?", [id]);
    return result[0];
}

async function selectUserByEmail(email) {
    const result = await client.query("SELECT * FROM users WHERE email = ?", [email]);
    return result[0][0];
}

async function selectUserByCpf(cpf) {
    const result = await client.query("SELECT * FROM users WHERE cpf = ?", [cpf]);
    return result[0][0];
}

async function updateUser(id, user) {
    await client.query("UPDATE users SET nome = ?, email = ?, senha = ? WHERE id = ?", [user.nome, user.email, user.senha, id]);
}

async function deleteUser(id) {
    await client.query("DELETE FROM users WHERE id = ?", [id]);
}

module.exports = {
    postUser,
    selectUsers,
    selectUser,
    selectUserByEmail,
    selectUserByCpf,
    updateUser,
    deleteUser
};
