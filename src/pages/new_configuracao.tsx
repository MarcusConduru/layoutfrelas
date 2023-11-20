/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Loading } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewConfiguracao: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [roles, setRoles] = useState<any>([])
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [doc_name, setDoc_name] = useState('')
    const [doc_value, setDoc_value] = useState('')
    const [password, setPassword] = useState('')
    const [select, setSelect] = useState('1')
    const navigate = useNavigate()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        axios.request({
            url: 'https://rup.lazaro-dev.online/public/api/v1/secure/roles',
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
                setRoles(response.data)
                setIsLoading(false)
          }).catch((error) => {
                setIsLoading(false)
                switch (error.response.status) {  
                    case 404:
                        localStorage.clear()
                        navigate('/login')
                        break;
                    case 440:
                        localStorage.clear()
                        navigate('/login')
                        break;
                    default:
                        alert(error.response.data.message.replace('doc name', 'tipo de documento').replace('doc value', 'numero do documento'))
                        break;
                }
            })
    }, [])

    const newUser = () => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        const data = {
            name,
            email,
            username,
            password,
            is_active: 1,
            role_id: select,
            doc_name,
            doc_value
        }

        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/users`,
            method: 'POST',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
        }).then(() => {
            alert('Usuário Criado com sucesso!')
            navigate('/configuracao')
        }).catch((error) => {
                setIsLoading(false)
                switch (error.response.status) {  
                    case 404:
                        localStorage.clear()
                        navigate('/login')
                        break;
                    case 440:
                        localStorage.clear()
                        navigate('/login')
                        break;
                    default:
                        alert(error.response.data.message)
                        break;
                }
        })
    }


    return (
        <div className="container">
            <div className="content">
                <h1>Novo Usuário</h1>
                <div className="data-info">
                    <div className="data-observation">
                        <label htmlFor="name">Nome:</label>
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className="data-observation">
                        <label htmlFor="username">Usuário:</label>
                        <input type="text"  id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>

                    <div className="data-observation">
                        <label htmlFor="email">Email:</label>
                        <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="data-observation">
                        <label htmlFor="doc_name">Tipo de documento:</label>
                        <input type="text" id="Tipo de documento" name="doc_name" value={doc_name} onChange={(e) => setDoc_name(e.target.value)}/>
                    </div>

                    <div className="data-observation">
                        <label htmlFor="doc_value">Numero do documento:</label>
                        <input type="text" id="doc_value" name="doc_value" value={doc_value} onChange={(e) => setDoc_value(e.target.value)}/>
                    </div>

                    <div className="data-observation">
                        <label htmlFor="senha">Nova Senha:</label>
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="data-observation">
                        <label htmlFor="select">Tipo de usuário:</label>
                        <select id="select" defaultValue={select} onChange={(e) => setSelect(e.target.value)}>
                            {roles.map((value: any) => (
                                <option key={value.id} value={value.id}>{value.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="save-button">
                        <button onClick={newUser}>Criar</button>
                    </div>
                </div>

                <div className="voltar">
                    <button onClick={() => {navigate('/configuracao')}}>Voltar</button>
                </div>
            </div>

            {isLoading && <Loading />}
        </div>
    );
}

export default NewConfiguracao;