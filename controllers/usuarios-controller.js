const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postCadastrarUsuario = async (req, res, next) => {
    try {

        const queryEmail = 'SELECT * FROM usuarios WHERE email = ?';
        const resultEmail = await mysql.execute(queryEmail, [req.body.email]);

        if (resultEmail.length > 0) {
            return res.status(401).send({ mensagem: 'Usuário já cadastrado' });
        }

        const hash = bcrypt.hashSync(req.body.senha, 10);

        const query = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
        const results = await mysql.execute(query, [req.body.email, hash]);

        const response = {
            mensagem: 'Usuário criado com sucesso',
            usuarioCriado: {
                id_usuario: results.insertId, 
                email: req.body.email
            }
        };
        return res.status(201).send(response);

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).send({ error: error.message });
    }
};

exports.postLogin = async (req, res, next) => {

    try {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const results = await mysql.execute(query, [req.body.email]); 

        if (results.length < 1) {
            return res.status(401).send({ mensagem: 'Email ou senha incorreta!' })
        }

        if (await bcrypt.compareSync(req.body.senha, results[0].senha)){
                const token = jwt.sign({
                    id_usuario: results[0].id_usuario,
                    email: results[0].email
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
                return res.status(200).send({ 
                    mensagem: 'Email ou senha incorreta!',
                    token: token 
                });
            }
            return res.status(401).send({ mensagem: 'Email ou senha incorreta!' });
    } catch (error) {
        return res.status(500).send({ mensagem: 'Email ou senha incorreta!' });
    }
};