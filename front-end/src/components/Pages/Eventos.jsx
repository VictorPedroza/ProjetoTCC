import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";
import './Eventos.css';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [usuarioCategoria, setUsuarioCategoria] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    descricao: "",
    data_evento: "",
    professor_id: "", // Esse campo precisa ser preenchido com o ID do usuário logado, se necessário
    categoria: "emprestimo",
    livro_id: ""
  });

  useEffect(() => {
    axios.get("http://localhost:8088/Eventos")
      .then((res) => setEventos(res.data))
      .catch((err) => console.error("Erro ao buscar eventos:", err));

    axios.get("http://localhost:8088/User", { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          setUsuarioCategoria(res.data.user.categoria);
          setNovoEvento(prev => ({ ...prev, professor_id: res.data.user.ID }));
          // Debug: Verifique se o ID do professor foi definido corretamente
          console.log("ID do professor:", res.data.user.ID);
        }
      })
      .catch((err) => console.error("Erro ao buscar dados do usuário:", err));
  }, []);

  const adicionarEvento = () => setShowModal(true);

  const handleChange = (e) => {
    setNovoEvento({ ...novoEvento, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Validação para verificar se os campos obrigatórios estão preenchidos
    if (!novoEvento.titulo || !novoEvento.descricao || !novoEvento.data_evento || !novoEvento.professor_id) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    console.log("Enviando evento:", novoEvento); // Debug para verificar os dados antes do envio

    axios.post("http://localhost:8088/Evento", novoEvento)
      .then((res) => {
        alert(res.data.Message);
        setShowModal(false);
        setEventos([...eventos, novoEvento]);
      })
      .catch((err) => {
        console.error("Erro ao adicionar evento:", err.response ? err.response.data : err.message);
        alert("Erro ao adicionar evento. Tente novamente.");
      });
  };

  return (
    <main>
      <div className="eventos-container">
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <div key={evento.id} className="evento-card">
              <h2>{evento.titulo}</h2>
              <p>{evento.descricao}</p>
              <p><strong>Data:</strong> {new Date(evento.data_evento).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>Nenhum evento disponível</p>
        )}
      </div>

      {usuarioCategoria === "professor" || usuarioCategoria === "admin" ? (
        <button onClick={adicionarEvento}
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

      {showModal && (
        <div className="modal" style={{ position: 'fixed', top: '20px', left: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
          <div className="modal-content">
            <h2>Adicionar Novo Evento</h2>
            <input
              type="text"
              name="titulo"
              value={novoEvento.titulo}
              onChange={handleChange}
              placeholder="Título do Evento"
              required
            />
            <textarea
              name="descricao"
              value={novoEvento.descricao}
              onChange={handleChange}
              placeholder="Descrição"
              required
            />
            <input
              type="date"
              name="data_evento"
              value={novoEvento.data_evento}
              onChange={handleChange}
              placeholder="Data do Evento"
              required
            />
            <select name="categoria" value={novoEvento.categoria} onChange={handleChange}>
              <option value="emprestimo">Empréstimo</option>
              <option value="debate">Debate</option>
            </select>
            <input
              type="text"
              name="livro_id"
              value={novoEvento.livro_id}
              onChange={handleChange}
              placeholder="ID do Livro"
            />
            <button onClick={handleSubmit} className="save-btn">Salvar Evento</button>
            <button onClick={() => setShowModal(false)} className="cancel-btn">Cancelar</button>
          </div>
        </div>
      )}
    </main>
  );
}
