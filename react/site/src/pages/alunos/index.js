
import Cabecalho from '../../components/cabecalho'
import Menu from '../../components/menu'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import LoadingBar from 'react-top-loading-bar'

import { Container, Conteudo } from './styled'

import { useState, useEffect, useRef } from 'react';

import Api from '../../service/api';
const api = new Api();


export default function Index() {

    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [precode, setPrecoDe] = useState('');
    const [precopor, setPrecoPor] = useState('');
    const [avaliacao, setAvaliacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [estoque, setEstoque] = useState('');
    const [imagem, setImagem] = useState('');
    const [idAlterando, setIdAlterando] = useState(0);

    const loading = useRef(null);

    async function listar() {
        loading.current.continuousStart();

        let r = await api.listar();
        setProdutos(r);

        loading.current.complete();
    }

    async function inserir() {

        if (idAlterando === 0) {
            let r = await api.inserir(produto, categoria, precode, precopor, avaliacao, descricao, estoque, imagem);

            if (r.erro)
                toast.error(`❌ ${r.erro}`);
            else
                toast.dark('✔️ Produto inserido!');
        } else {
            let r = await api.alterar(idAlterando, produto, categoria, precode, precopor, avaliacao, descricao, estoque, imagem);

            if (r.erro)
                toast.error(`❌ ${r.erro}`);
            else
                toast.dark(' ✔️ Produto alterado!');
        }

        limparCampos();
        listar();
    }

    function limparCampos() {
        setProduto('');
        setCategoria('');
        setPrecoDe('');
        setPrecoPor('');
        setAvaliacao('');
        setDescricao('');
        setEstoque('');
        setImagem('');
        setIdAlterando(0);
    }

    async function remover(id) {
        confirmAlert({
            title: 'Remover Produto',
            message: `Tem certeza que deseja remover o produto ${id} ?`,
            buttons: [
              {
                label: 'Sim', 
                onClick: async () => {
                    let r = await api.remover(id);
                    if (r.erro)
                        toast.error(`${r.erro}`);
                    else {
                        
                        toast.dark('✔️ Produto removido!')
                        listar();
                    }
                }
              },
              {
                label: 'Não'
              }
            ]
        });
    }


    async function editar(item) {
        setProduto(item.nm_produto);
        setCategoria(item.ds_categoria);
        setPrecoDe(item.vl_preco_de);
        setPrecoPor(item.vl_preco_por);
        setAvaliacao(item.vl_avaliacao);
        setDescricao(item.ds_produto);
        setEstoque(item.qtd_estoque);
        setImagem(item.img_produto);
        setIdAlterando(item.id_produto);
    }


    useEffect(() => {
        listar();
    }, [])


    return (
        <Container>
            <ToastContainer/>
            <LoadingBar color="#10EAEA" ref={loading}/>
            <Menu />
            <Conteudo>
                <Cabecalho />
                <div class="body-right-box">
                    <div class="new-student-box">
                        
                        <div class="text-new-student">
                            <div class="bar-new-student"></div>
                            <div class="text-new-student"> {idAlterando === 0 ? "Novo Produto" : "Alterando Produto " + idAlterando } </div>
                        </div>

                        <div class="input-new-student"> 
                            <div class="input-left">
                                <div class="agp-input"> 
                                    <div class="name-student"> Nome: </div>  
                                    <div class="input"> <input type="text" value={produto} onChange={e => setProduto(e.target.value)} /> </div>  
                                </div> 
                                <div class="agp-input">
                                    <div class="number-student"> Categoria: </div>  
                                    <div class="input"> <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} /> </div> 
                                </div>
                                <div class="agp-input">
                                    <div class="number-student"> Avaliação: </div>  
                                    <div class="input"> <input type="text" value={avaliacao} onChange={e => setAvaliacao(e.target.value)} /> </div>  
                                </div>
                            </div>


                            <div class="input-right">
                                <div class="agp-input">
                                    <div class="corse-studenta"> Preço DE: </div>  
                                    <div class="input"> <input type="text" value={precode} onChange={e => setPrecoDe(e.target.value)} /> </div>  
                                </div>
                                <div class="agp-input">
                                    <div class="class-student"> Preço POR: </div>  
                                    <div class="input"> <input type="text" value={precopor} onChange={e => setPrecoPor(e.target.value)} /> </div> 
                                </div>
                                <div class="agp-input">
                                    <div class="corse-student"> Estoque: </div>  
                                    <div class="input"> <input type="text" value={estoque} onChange={e => setEstoque(e.target.value)} /> </div>  
                                </div>
                            </div>
                        </div>
                        <div class="input-avaliandstok">
                            <div class="agp-input">
                                    <div class="link-image"> Link Imagem: </div>  
                                    <div class="input-img"> <input type="text" value={imagem} onChange={e => setImagem(e.target.value)} /> </div>  
                            </div>
                        </div>
                        <div class="input-abx">
                            <div class="descri-abx"> Descrição: </div>
                            <textarea class="textarea-abx" type="text" value={descricao} onChange={e => setDescricao(e.target.value)}/>
                            <div class="button-create"> <button onClick={inserir}> {idAlterando === 0 ? "Cadastrar" : "Alterar"} </button> </div>
                        </div>
                    </div>

                    <div class="student-registered-box">
                        <div class="row-bar"> 
                            <div class="bar-new-student"> </div>
                            <div class="text-registered-student"> Produtos Cadastrados </div>
                        </div>
                    
                        <table class ="table-user">
                            <thead>
                                <tr>
                                    <th> </th>
                                    <th> ID </th>
                                    <th> Produto </th>
                                    <th> Categoria </th>
                                    <th> Preço </th>
                                    <th> Estoque </th>
                                    <th class="coluna-acao"> </th>
                                    <th class="coluna-acao"> </th>
                                </tr>
                            </thead>

                            <tbody>

                                {produtos.map((item, i) =>

                                    <tr className={i % 2 === 0 ? "linha-alternada" : ""}>
                                        <td title={item.img_produto}> <img src={item.img_produto} alt='' style={{width: '40px', height: '40px'}}/> </td>
                                        <td> {item.id_produto} </td>
                                        <td title={item.nm_produto}>
                                            {item.nm_produto != null && item.nm_produto.length >= 20
                                                ? item.nm_produto.substr(0, 20) + '...'
                                                : item.nm_produto}
                                        </td>
                                        <td title={item.ds_categoria}> 
                                            {item.ds_categoria != null && item.ds_categoria.length >= 20
                                                    ? item.ds_categoria.substr(0, 20) + '...'
                                                    : item.ds_categoria} 
                                        </td>
                                        <td> {item.vl_preco_por} </td>
                                        <td> {item.qtd_estoque} </td>
                                        <td class="coluna-acao"> <button onClick={() => editar(item)}> <img src="/assets/images/edit.svg" alt="" /> </button> </td>
                                        <td class="coluna-acao"> <button onClick={() => remover(item.id_produto)}> <img src="/assets/images/trash.svg" alt="" /> </button> </td>
                                    </tr>
                                )}

                            </tbody> 
                        </table>
                    </div>
                </div>
            </Conteudo>
        </Container>
    )
}
