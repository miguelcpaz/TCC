const mysql = require("mysql2/promise");
const client = mysql.createPool(process.env.CONNECTION_STRING);
const puppeteer = require('puppeteer');

async function postUser(user) {
    const values = [user.nome, user.email, user.senha, user.cpf, user.crm, user.tipo_user];
    await client.query(
        "INSERT INTO users (nome, email, senha, cpf, crm, tipo_user) VALUES (?, ?, ?, ?, ?, ?)", 
        values
    );
}

async function selectUserByEmail(email) {
    const result = await client.query("SELECT * FROM users WHERE email = ?", [email]);
    return result[0][0];
}

async function selectUserByCpf(cpf) {
    const result = await client.query("SELECT * FROM users WHERE cpf = ?", [cpf]);
    return result[0][0];
}

async function consultarCorenPorCPF(cpf) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://servicos.coren-sp.gov.br/consulta-de-profissionais/', { waitUntil: 'networkidle0' });

    await page.waitForTimeout(2000);

    await page.waitForSelector('input[name="app_busca_de_profissionais[cpf]"]', { timeout: 10000 });
    await page.type('input[name="app_busca_de_profissionais[cpf]"]', cpf);

    await page.waitForSelector('button[type="submit"]', { timeout: 5000 });
    await page.click('button[type="submit"]');

    console.log('Por favor, resolva o CAPTCHA no navegador.');

    await page.waitForSelector('.resultado', { timeout: 30000 });

    const resultado = await page.$eval('.resultado', el => el.textContent);

    const isProfissionalValido = resultado.includes('Nome do Profissional') || resultado.includes('Cadastro');

    await browser.close();

    return isProfissionalValido;
}


module.exports = { postUser, selectUserByEmail, selectUserByCpf, consultarCorenPorCPF };
