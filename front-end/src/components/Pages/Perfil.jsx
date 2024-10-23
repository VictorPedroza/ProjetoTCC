import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Perfil.css';

export default function Perfil() {
  const [user, setUser] = useState(null);
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

  return (
    <main className="perfil-main">
      <div className="accordion">
        <div className="accordion-item infos-user">
          <div className="accordion-button ">
            <div className="accordion-content">
              {user ? (
                <>
                  <h1>Perfil</h1>
                  <p>Nome: {user.Nome}</p>
                  <p>Email: {user.Email}</p>
                  <p>Senha: {user.Senha}</p>
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
            <div className="accordion-button" onClick={() => toggleAccordion(1)}>
              <h2>Registro de Livros Alugados</h2>
            </div>
            {activeIndex === 1 && (
              <div className="accordion-content">
                <p>Futuro registro de livros alugados.</p>
              </div>
            )}
          </div>
          <div className="accordion-item infos-eventos">
            <div className="accordion-button" onClick={() => toggleAccordion(2)}>
              <h2>Futuros Eventos</h2>
            </div>
            {activeIndex === 2 && (
              <div className="accordion-content">
                <p>Futuros eventos que participou/participa.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </main>
  );
}
