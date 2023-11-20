/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Loading } from '../components';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateConfiguracao: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [roles, setRoles] = useState<any>([])
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [doc_name, setDoc_name] = useState('')
    const [doc_value, setDoc_value] = useState('')
    const [password, setPassword] = useState('')
    const [select, setSelect] = useState('')
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        Promise.all([axios.request({
            url: 'https://rup.lazaro-dev.online/public/api/v1/secure/roles',
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }),  axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/users/${id}`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          })]).then((response) => {
                setRoles(response[0].data)
                setName(response[1].data.name)
                setUsername(response[1].data.username)
                setEmail(response[1].data.email)
                setDoc_name(response[1].data.doc_name)
                setDoc_value(response[1].data.doc_value)
                setSelect(response[1].data.roles[0].id)
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
                        alert('Algo de errado aconteceu. Tente novamente mais tarde.')
                        break;
                }
            })
    }, [])

    const editUser = () => {
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
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/users/${id}`,
            method: 'PUT',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
        }).then(() => {
            alert('Usuário alterado com sucesso!')
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
                        alert(error.response.data.message.replace('doc name', 'tipo de documento').replace('doc value', 'numero do documento'))
                        break;
                }
        })
    }


    return (
        <div className="container">
            <div className="content">
                <h1>Editar Usuário</h1>
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
                        {select && (
                            <select id="select" defaultValue={select} onChange={(e) => setSelect(e.target.value)}>
                            {roles.map((value: any) => (
                                <option key={value.id} value={value.id}>{value.name}</option>
                            ))}
                        </select>
                        )}
                    </div>
                    <div className="save-button">
                        <button onClick={editUser}>Salvar</button>
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

export default UpdateConfiguracao;