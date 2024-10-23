import React from 'react';
import { NavLink } from 'react-router-dom';
import "./Footer.css";

export default function Footer() {

    return (
        <footer>
            <header>
                <h2>Explore o conhecimento: Onde cada página é uma nova aventura</h2>
                <div className='buttons-footer'>
                    <button>RECEBER NOVIADADES</button>
                    <button className='second-button'>AJUDAR</button>
                </div>
            </header>
            <main>
                <div className='paginas'>
                    <h2>Páginas</h2>
                    <NavLink to='/'>Início</NavLink>
                    <NavLink to='/Livros'>Livros</NavLink>
                    <NavLink to='/Eventos'>Eventos</NavLink>
                    <NavLink to='/Perfil'>Perfil</NavLink>
                </div>
                <div className='contato'>
                    <h2>Contato</h2>
                    <ul>
                        <li>
                            <p>Rua Francisco Falcato Jr. 465</p>
                            <p>Itu, SP, 13304-170</p>
                        </li>
                        <li>
                            <p>(11) 4024-3389</p>
                        </li>
                        <li>
                            educacao.sp.gov.br
                        </li>
                        
                    </ul>
                </div>
            </main>
            <p>Todos os direitos reservados <span>&copy;MakTech Solutions</span></p>
        </footer>
    )
}