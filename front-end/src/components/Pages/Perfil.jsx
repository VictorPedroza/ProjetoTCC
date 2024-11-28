import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Perfil.css';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [alugueis, setAlugueis] = useState([]);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8088/User")
      .then(res => {
        if (res.data.Status === "Success") {
          setUser(res.data.user);
        } else {
          setError("Erro ao carregar dados do usuário");
        }
      })
      .catch(err => {
        setError("Erro na requisição: " + err.message);
      });
  }, []);
  
  useEffect(() => {
    axios.get("http://localhost:8088/alugueis")
      .then(res => {
        if (res.data.Status === "Success") {
          setAlugueis(res.data.alugueis);
        } else {
          setError("Erro ao carregar dados do usuário");
        }
      })
      .catch(err => {
        setError("Erro na requisição: " + err.message);
      });
  }, []);

  const handleLogout = () => {
    axios.get("http://localhost:8088/Logout")
      .then(res => {
        if (res.data.Status === "Success") {
          window.location.reload(true);
        } else {
          alert("Erro ao sair");
        }
      })
      .catch(err => console.log(err));
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Função para formatar o ID com 6 dígitos
  const formatID = (id) => {
    return id.toString().padStart(6, '0');
  };

  // Função para definir a cor baseada no status
  const getStatusColor = (status) => {
    switch (status) {
      case 'cancelado':
        return 'red';
      case 'ativo':
        return 'green';
      case 'solicitado':
        return 'orange';
      default:
        return 'black';
    }
  };

  return (
    <main className="perfil-main">
      <div className="accordion">
        <div className="accordion-item infos-user">
          <div className="accordion-button ">
            <div className="accordion-content">
              {user ? (
                <>
                  <h1>Perfil</h1>
                  <p>Seja Bem-Vindo, {user.Nome}</p>
                  <p>ID: {user.ID}</p>
                </>
              ) : (
                <>
                  <h1>Perfil</h1>
                  <p>Login não realizado!</p>
                </>
              )}
              {user ? (
                <button onClick={handleLogout} className=" btn-logout">SAIR</button>
              ) : (
                <button onClick={() => navigate('/login')} className="btn-login">LOGIN</button>
              )}
            </div>
          </div>
        </div>
        <div className="infos-adicionais">
          <div className="accordion-item infos-aluguel">
            <div className="accordion-button">
              <h2>Registro de Livros Alugados</h2>
            </div>
            <div className="accordion-content">
              {alugueis.length > 0 ? (
                alugueis.map((aluguel, index) => (
                  <div key={index} className="alugueis">
                    <p><p className="title-aluguel">Nome do Livro:</p> {aluguel.nome_livro}</p>
                    <p style={{ color: getStatusColor(aluguel.status) }}>
                      <p className="title-aluguel">Status:</p> {aluguel.status}
                    </p>
                    <p><p className="title-aluguel">Código de Retirada:</p> {formatID(aluguel.ID)}</p>
                  </div>
                ))
              ) : (
                <p>Futuro registro de livros alugados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
