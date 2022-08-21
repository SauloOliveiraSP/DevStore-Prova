import db from './db.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

app.get('/produto', async (req, resp) => {
    try {
        let produtos = await db.tb_produto.findAll({ order: [['id_produto', 'desc']] });
        resp.send(produtos);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/produto', async (req, resp) => {
    try {
        let { produto, categoria, precode, precopor, avaliacao, descricao, estoque, imagem } = req.body;

        if (produto == '' || categoria == '' || precode == '' || precopor == '' || avaliacao == '' || descricao == '' || estoque == '' || imagem == '')
            return resp.send({ erro: ' Todos os campos devem ser inseridos!' });

        if (precode <= 0 || precopor <= 0 || avaliacao <= 0 || estoque <= 0)
            return resp.send({ erro: ' Somente Números no campos de PREÇO DE, PREÇO POR, AVALIAÇÃO E ESTOQUE!' });

        if (!isNaN(precopor) == false) {
            return resp.send({ erro: ' No campo PREÇO POR coloque APENAS Números!' })
        }

        if (!isNaN(avaliacao) == false) {
            return resp.send({ erro: ' No campo AVALIAÇÃO coloque APENAS Números!' })
        }

        if (!isNaN(precode) == false)
            return resp.send({ erro: ' No campo PREÇO DE coloque APENAS Números!' })

        if (!isNaN(estoque) == false)
            return resp.send({ erro: ' No campo ESTOQUE coloque APENAS Números!' })

        let valic = await db.tb_produto.findOne({ where: { nm_produto: produto } });

        if (valic != null)
            return resp.send({ erro: ' O Produto já existe nesta turma!' });

        let r = await db.tb_produto.create({
            nm_produto: produto,
            ds_categoria: categoria,
            vl_preco_de: precode,
            vl_preco_por: precopor,
            ds_produto: descricao,
            qtd_estoque: estoque,
            img_produto: imagem,
            bt_ativo: true,
            dt_inclusao: new Date()
        })
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.put('/produto/:id', async (req, resp) => {
    try {
        let { produto, categoria, precode, precopor, avaliacao, descricao, estoque, imagem } = req.body;
        let { id } = req.params;

        if (produto == '' || categoria == '' || precode == '' || precopor == '' || avaliacao == '' || descricao == '' || estoque == '' || imagem == '')
            return resp.send({ erro: ' Todos os campos devem ser inseridos!' });

        if (precode <= 0 || precopor <= 0 || avaliacao <= 0 || estoque <= 0)
            return resp.send({ erro: ' Somente Números no campos de PREÇO DE, PREÇO POR, AVALIAÇÃO E ESTOQUE!' });

        let r = await db.tb_produto.update(
            {
                nm_produto: produto,
                ds_categoria: categoria,
                vl_preco_de: precode,
                vl_preco_por: precopor,
                ds_produto: descricao,
                qtd_estoque: estoque,
                img_produto: imagem,
                bt_ativo: true,
                dt_inclusao: new Date()
            },
            {
                where: { id_produto: id }
            }
        )
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.delete('/produto/:id', async (req, resp) => {
    try {
        let { id } = req.params;

        let r = await db.tb_produto.destroy({ where: { id_produto: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.listen(process.env.PORT, x => console.log(`Server up at port ${process.env.PORT}`))