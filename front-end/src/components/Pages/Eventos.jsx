import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";
import './Eventos.css';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [usuarioCategoria, setUsuarioCategoria] = useState(null); // Estado para armazenar a categoria do usuário

  useEffect(() => {
    // Fazendo a requisição para obter os eventos
    axios
      .get("http://localhost:8088/Eventos")
      .then((res) => {
        setEventos(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar eventos:", err);
      });

    // Fazendo a requisição para obter os dados do usuário
    axios
      .get("http://localhost:8088/User", { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          setUsuarioCategoria(res.data.user.categoria); // Supondo que a coluna de categoria na tabela seja 'Categoria'
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do usuário:", err);
      });
  }, []);

  const formatarData = (data) => {
    const novaData = new Date(data);
    if (isNaN(novaData)) {
      return "Data inválida";
    }
    return novaData.toLocaleDateString();
  };

  const adicionarEvento = () => {
    // Lógica para adicionar um novo evento
    alert("Adicionar novo evento!");
  };

  return (
    <main>
      <div className="eventos-container">
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <div key={evento.id} className="evento-card">
              <h2>{evento.titulo}</h2>
              <p>{evento.descricao}</p>
              <p><strong>Data:</strong> {formatarData(evento.data_evento)}</p>
            </div>
          ))
        ) : (
          <p>Nenhum evento disponível</p>
        )}
      </div>

      {usuarioCategoria === "professor" || usuarioCategoria === "admin" ? (
        <button 
          onClick={adicionarEvento}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#37a102",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            color: "white",
            border: "none",
            borderRadius: "5rem",
            cursor: "pointer",
            fontSize: "16px",
            width: "auto"
          }}
        >
          <IoIosAdd style={{ color: 'white', fontSize: '32px' }} />
        </button>
      ) : null}
    </main>
  );
}
