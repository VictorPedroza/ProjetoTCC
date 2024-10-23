import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Login.css';  // Aparentemente o CSS está compartilhado

export default function Register() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.email.includes('@')) {
            alert('Por favor, insira um email válido.');
            return;
        }
        if (values.password.length < 5) {
            alert('A senha deve ter pelo menos 5 caracteres.');
            return;
        }
        axios.post('http://localhost:8088/Register', values)
            .then(res => {
                if (res.data.Status === "Success") {
                    alert("Registro bem-sucedido");
                    navigate('/Login');  // Após sucesso, redireciona para a página de login
                } else {
                    alert(res.data.Message);
                }
            })
            .catch(err => {
                console.log(err);
                alert('Erro no servidor. Tente novamente mais tarde.');
            });
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name"><strong>Nome:</strong></label>
                    <input
                        type="text"
                        placeholder="Digite seu Nome"
                        name="name"
                        autoComplete="off"
                        onChange={e => setValues({ ...values, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email"><strong>Email:</strong></label>
                    <input
                        type="email"
                        placeholder="Digite seu Email"
                        name="email"
                        autoComplete="off"
                        onChange={e => setValues({ ...values, email: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password"><strong>Senha:</strong></label>
                    <input
                        type="password"
                        placeholder="Digite sua Senha"
                        name="password"
                        onChange={e => setValues({ ...values, password: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn-login">Registrar</button>
                <p className="terms">Aceito todos os termos e políticas!</p>
            </form>
        </div>
    );
}
