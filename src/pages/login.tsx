import React, { useEffect, useState } from 'react';
import empresaImg  from '../assets/logo_login.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components';

const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        if(token) {
            navigate('/')
        }
    })
    
    const login = () => {
        setLoading(true)
        const data = {
            email, 
            password
        }

        axios.post('https://rup.lazaro-dev.online/public/api/v1/auth/login', data).then((response) => {
            localStorage.setItem('accessToken', JSON.stringify({
                accessToken: response.data.access_token,
                user: response.data.user
            }))
            navigate('/')
    }).catch((error) => {
        setLoading(false)
        if(email || password) {
        alert('Preencha corretamente os campos.')
        } else {
        switch (error.response.status) {   
            case 401:
                alert('Usuário não autorizado.')
                break
            default:
                alert('Algo de errado aconteceu. Tente novamente mais tarde.')
                break;
        }
        }
    })
    }

    return (
    <div className="container2">
        <div className="green-section">
            <img src={empresaImg} alt="Logo da empresa" width="150" />
            <p className="system-description">SISTEMA DE MENSURAÇÃO E CONTROLE DE MÃO DE OBRA DA CONSTRUÇÃO CIVIL</p>
        </div>
        <div className="white-section">
            <div className="form-container2">
                <h2>Login</h2>
                <form>
                    <label htmlFor="username">Email</label>
                    <input type="text" id="email" name="email" required placeholder="Digite seu usuário" onChange={e => setEmail(e.currentTarget.value)}/>
                
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" required name="password" placeholder="Digite sua senha" onChange={e => setpassword(e.currentTarget.value)}/>
                
                    <button type="button" id="loginForm" disabled={(!email || !password) ? true : false} onClick={login}>Entrar</button>
                </form>
            </div>
        </div>
        {loading && <Loading />}
    </div>

  );
}

export default Login;