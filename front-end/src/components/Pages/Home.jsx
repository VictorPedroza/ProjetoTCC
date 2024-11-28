import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../Card/Card';
import { Link } from 'react-router-dom';
import './Home.css';
import { FaCaretRight } from "react-icons/fa";
import { FaCaretLeft } from "react-icons/fa";

function Home() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // Estado para definir o número de livros por página
  const [booksPerPage, setBooksPerPage] = useState(15); // Inicia com 15 livros para desktop
  const [currentPageHistoria, setCurrentPageHistoria] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:8088')
      .then(res => {
        if (res.data.Message === 'Success') {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Message);
        }
      })
      .catch(error => {
        setMessage('Erro na requisição: ' + error.message);
      });
  }, []);

  const [Historia, setHistoria] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8088/Historia")
      .then(res => res.json())
      .then(Historia => setHistoria(Historia))
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, []);

  // Função para atualizar o número de livros por página com base no tamanho da tela
  const updateBooksPerPage = () => {
    if (window.innerWidth < 768) {
      setBooksPerPage(2); // Celulares
    } else if (window.innerWidth < 1000) {
      setBooksPerPage(4); // Tablets
    } else {
      setBooksPerPage(5); // Desktops
    }
  };

  // Executa ao montar o componente e ao redimensionar a janela
  useEffect(() => {
    updateBooksPerPage(); // Chama inicialmente
    window.addEventListener('resize', updateBooksPerPage); // Adiciona o listener

    return () => {
      window.removeEventListener('resize', updateBooksPerPage); // Limpa o listener
    };
  }, []);

  
  const totalHistoria = Historia.length;
  const totalPagesHistoria = Math.ceil(totalHistoria / booksPerPage);
  const startIndexHistoria = (currentPageHistoria - 1) * booksPerPage;
  const currentHistoriaBooks = Historia.slice(startIndexHistoria, startIndexHistoria + booksPerPage);

  const handleNext = () => {
    setCurrentPageHistoria(prev => Math.min(prev + 1, totalPagesHistoria));
  };

  const handlePrev = () => {
    setCurrentPageHistoria(prev => Math.max(prev - 1, 1));
  };

  return (
    <main>
      <header>
        {auth ? (
          <div className='head-home'>
            <h1>Seja Bem-Vindo</h1>
            <span>{name}</span>
          </div>
        ) : (
          <div className='head-home'>
            <div className="chamada">
              <h1>Entre no Mundo</h1>
              <h2>Da Leitura</h2>
            </div>
            <div className="buttons">
              <Link to='/Login'><button className='btn'>Entrar</button></Link>
              <Link to='/Register'><button className='btn btn-secondary'>Registrar-se</button></Link>
            </div>
          </div>
        )}
      </header>

      {/* Cards de História */}
      <div className="card-container">
        <div className='h1-card'>
          <h1 >História</h1>
        </div>

        <Card categoria={currentHistoriaBooks} />

        {/* Botões de Paginação */}
        <div className="carousel-controls">
          <button onClick={handlePrev} disabled={currentPageHistoria === 1}>
            <FaCaretLeft size={50} />
          </button>
          <button onClick={handleNext} disabled={currentPageHistoria === totalPagesHistoria}>
            <FaCaretRight size={50} />
          </button>
        </div>
      </div>
    </main>
  );
}

export default Home;
