import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './LivroDetalhes.css';

export default function LivroDetalhes() {
  const location = useLocation();
  const { livro } = location.state;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica se o usuário está logado
    fetch('http://localhost:8088/User', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.Status === "Success") {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(error => {
        console.error('Erro ao verificar login:', error);
        setIsLoggedIn(false);
      });
  }, []);

  const handleAlugar = async () => {
    if (isLoggedIn) {
        try {
            const response = await axios.post('http://localhost:8088/aluguel', {
                usuario_id: user.ID,
                livro_id: livro.ID,
                data_inicio: new Date().toISOString(), // data atual
                data_devolucao: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // 7 dias depois
                status: 'ativo',
                observacoes: 'Aluguel de teste', // ou qualquer outra observação que você queira adicionar
            });

            alert(`Aluguel solicitado com sucesso!`);
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                alert(`Erro ao criar aluguel: ${error.response.data.message}`);
                console.error(error.response.data.errors || error.response.data.message);
            } else {
                alert("Erro na conexão com o servidor. Tente novamente mais tarde.");
                console.error(error);
            }
        }
    } else {
        alert("Faça login para poder alugar um livro!");
    }
};

  return (
    <div className='conteiner-detalhe'>
      <img src={livro.imagem} alt={livro.Nome} />
      <div className="conteiner-livro">
        <div className="titulo">
          <h1>{livro.Nome}</h1>
          <p>{livro.autor}</p>
        </div>
        <div className="buttons">
          <button className='btn' onClick={handleAlugar}>Alugar</button>
        </div>
        <div className="infos-livro">
          <h1>Editora: </h1>
          <p>{livro.editora}</p>
          <h1>ISBN: </h1>
          <p>{livro.ISBN}</p>
          <h1>Ano de Publicação</h1>
          <p>{livro.ano_publi}</p>
          <h1>Número de Páginas</h1>
          <p>{livro.num_pag}</p>
          <h1>Categoria:</h1>
          <p>{livro.categoria}</p>
          <h1>Disponibilidade:</h1>
          <p className={livro.qtd > 0 ? 'disponivel' : 'indisponivel'}>
            {livro.qtd > 0 ? "Disponível" : "Indisponível"}
          </p>
        </div>
      </div>
    </div>
  );
}
