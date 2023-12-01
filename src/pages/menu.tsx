/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
                <a className='help' target='_blank' href='https://www.calameo.com/read/007536497958be8ca36d5' rel="noreferrer">Ajuda</a>
                <div className="user" id="name">Olá, {token?.user.name}</div>
            </div>
            <div className="menu">
                <h1>Menu</h1>
                <div className="buttons3">
                    <button onClick={() => navigate('/painel/obra')}> 
                        <span className="icon icon-controle"></span> 
                        Controle de Obra
                    </button>
                    <button onClick={() => navigate('/painel/etapa/obra')}> 
                        <span className="icon icon-cadastro"></span>
                        Gerenciamento RUP
                    </button>
                    {token?.user.roles[0].name !== 'Visualizador' && (
                        <button onClick={() => navigate('/painel/tipo')}> 
                            <span className="icon icon-gerenciamento"></span> 
                            Tipos de etapas
                        </button>
                    )}
                    {token?.user.roles[0].name !== 'Comum' && (
                        <button onClick={() => navigate('/relatorio/tipo')}> 
                            <span className="icon icon-relatorio"></span> 
                            Relatórios e Dashboards
                        </button>
                    )}
                    <button onClick={() => navigate('/Calculadora')}> 
                        <span className="icon icon-calculadora"></span>
                        Calculadora de Equipe
                    </button>
                    {token?.user.roles[0].name === 'Administrador' && (
                        <button onClick={() => navigate('/configuracao')}> 
                            <span className="icon icon-configuracao"></span> 
                            Controle de usuários
                        </button>
                    )}
                </div>
                <div className="logout">
                    <button id="logout" onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Menu;