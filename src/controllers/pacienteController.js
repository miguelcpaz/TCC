const mysql = require('mysql2/promise');
const client = mysql.createPool(process.env.CONNECTION_STRING);

async function registerPaciente(req, res) {
    const { nome, idade, relatorio, prescricao, estadia} = req.body;

    try {

        await client.query(
            "INSERT INTO pacientes (nome, idade, relatorio, prescricao, estadia) VALUES (?, ?, ?, ?, ?)",
            [nome, idade, relatorio, prescricao, estadia]
        );


        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
}

async function getPacientes(req, res) {
    try {
      const [rows] = await client.query('SELECT * FROM pacientes');
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar pacientes.' });
    }
  }
module.exports = {
    registerPaciente,
    getPacientes
};