const mysql = require('../mysql');

exports.getPedidos = async (req, res, next) => {

    try {
        const query = `SELECT pedidos.id_pedido,
                            pedidos.quantidade,
                            produtos.id_produto,
                            produtos.nome,
                            produtos.preco  
                        FROM pedidos
                    INNER JOIN produtos
                ON produtos.id_produto = pedidos.id_produto;`;

        const result = await mysql.execute(query);
        const response = {
            pedidos: result.map(pedido => {
                return {
                    id_pedido: pedido.id_pedido,
                    quantidade: pedido.quantidade,
                    produto: {
                        id_produto: pedido.id_produto,
                        nome: pedido.nome,
                        preco: pedido.preco
                    },                          
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um pedido específico',
                        url: process.env.URL_API + 'pedidos',
                    }
                }
            })
        }
        return res.status(200).send({response})
    } catch (error) {
        if (error) { return res.status(500).send({ error: error})}
    }
};

exports.postPedidos = async (req, res, next) => {

    try {
        const queryProduto = 'SELECT * FROM produtos WHERE id_produto = ?';
        const resultProduto = await mysql.execute(queryProduto, [req.body.id_produto]);

        if (resultProduto.length == 0){
            return res.status(404).send({
                mensagem: 'Este produto não foi encontrado'
            });
        }

        const queryPedido = 'INSERT INTO pedidos (quantidade, id_produto) VALUES (?,?)';
        const resultPedido = await mysql.execute(queryPedido, [req.body.quantidade, req.body.id_produto]);

        const response = {
            mensagem: "Pedido inserido com sucesso",
            pedidoCriado : {
                id_pedido: resultPedido.id_pedido,
                quantidade : req.body.quantidade,
                id_produto: req.body.id_produto,
                request: {
                    tipo: 'GET',
                    decricao: 'Retorna todos os pedidos',
                    url: process.env.URL_API + 'pedido'                               
                }
            }
        }
        return res.status(201).send( response );

    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error});
    }
};

exports.getPedidosId = async (req, res, next)=> {
    
    try {
        const query = 'SELECT * FROM pedidos WHERE id_pedido = ?;';
        const result = await mysql.execute(query, [req.body.id_pedido]);

        if (result.length == 0){
            return res.status(404).send({
                mensagem: 'Não foi encontrado o pedido com o este ID'
            })
        }

        const response = {
            pedido : {
                id_pedido: result[0].id_pedido,
                quantidade : result[0].quantidade,
                id_produto: result[0].id_produto,
                request: {
                    tipo: 'GET',
                    decricao: 'Retorna um pedido',
                    url: process.env.URL_API + 'pedido'
                }
            }
        }
        return res.status(201).send({ response });
        
    } catch (error) {
        if (error) { return res.status(500).send({ error: error})}
    }
};

exports.deletePedidos = async (req, res, next) => {

    try {
       const query = `DELETE FROM pedidos WHERE id_pedido = ?`;
       await mysql.execute(query, [req.body.id_pedido]);

        const response = {
            mensagem: 'Pedido removido com sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um pedido',
                url: process.env.URL_API + 'pedido',
                body: {
                    quantidade: 'Number',
                    id_produto: 'Number'
                }
            }
        }
        return res.status(202).send({ response });
    } catch (error) {
        if (error) { return res.status(500).send({ error: error })}
    }
};