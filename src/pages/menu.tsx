/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import menu from '../assets/logo_menu.png'
import { useNavigate } from 'react-router-dom';

const Menu: React.FC = () => {
    const navigate = useNavigate()
    const [token, setToken] = useState<any>()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }
        setToken(token)
    }, [])

    const logout = () => {
        localStorage.clear()
        navigate('/login')
      }

    return (
        <div className="container3">
            <div className="top-bar">
                <div className="help">Ajuda</div>
                <div className="user" id="name">{token?.user.name}</div>
            </div>
            <div className="menu">
                <img src={menu} alt="Logo da empresa" width="150" />
                <div className="buttons3">
                    <button onClick={() => navigate('/painel/obra')}> 
                        <span className="icon icon-controle"></span> 
                        Controle de Obra
                    </button>
                    <button onClick={() => {navigate('/painel/etapa/obra')}}> 
                        <span className="icon icon-cadastro"></span>
                        Controle de Etapas
                    </button>
                    <button onClick={() => {navigate('/painel/tipo')}}> 
                        <span className="icon icon-gerenciamento"></span> 
                        Tipos de etapas
                    </button>
                    <button className="location.href='relatorio.html'"> 
                        <span className="icon icon-relatorio"></span> 
                        Relatórios e Dashboards
                    </button>
                    <button className="location.href='calculadora_equipe.html'"> 
                        <span className="icon icon-calculadora"></span>
                        Calculadora de Equipe
                    </button>
                    <button onClick={() => navigate('/configuracao')}> 
                        <span className="icon icon-configuracao"></span> 
                        Controle de usuários
                    </button>
                </div>
                <div className="logout">
                    <button id="logout" onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Menu;