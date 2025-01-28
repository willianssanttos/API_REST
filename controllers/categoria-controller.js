const mysql = require('../mysql');

exports.getCategoria = async (req, res, next) => {

    try {
        const result = await mysql.execute("SELECT * FROM categorias;")
        const response = {
            caminho: result.length,
            categoria: result.map(categoria => {
                return {
                    id_categoria: categoria.id_categoria,
                    nome: categoria.nome
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postCategoria = async (req, res, next) => {

    try {
        const query = 'INSERT INTO categorias (nome) VALUES (?)';
            const result = await mysql.execute(query, [ req.body.nome ]);

                const response = {
                    mensagem: "Categoria inserida com sucesso",
                    categoriaCriada : {
                        id_categoria: result.insertId,
                        nome: req.body.nome,
                        request: {
                            tipo: 'GET',
                            decricao: 'Retorna todos as categorias',
                            url: process.env.URL_API + 'categoria'                        
                        }
                    }
                }
            return res.status(201).send({ response });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error });
    }
};