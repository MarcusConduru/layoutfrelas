/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components';

const Configuracao: React.FC = () => {
    const [users, setUsers] = useState<any>([])
    const [isLoading,setIsLoading] = useState(true)
    const [isClose,setIsClose] = useState(false)
    const [isChange, setIsChange] = useState(false)
    const [id, setId] = useState('')
    const [token, setToken] = useState<any>('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        setToken(token)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }

        axios.request({
            url: 'https://rup.lazaro-dev.online/public/api/v1/secure/users',
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
            setUsers(response.data.data)
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
    }, [isChange])

    const deleteUser = (id: string) => {
        setIsLoading(true)
        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/users/${id}`,
            method: 'DELETE',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then(() => {
            setIsChange(!isChange)
            setIsClose(false)
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
    }

    return (
        <div className="container">
            <div className="content">
                <h1>Lista de Usuários</h1>
                <div className="data-info">
                    <div className="data">
                        <button onClick={() => navigate('/configuracao/novo')}>Criar Usuário</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                
                        <tbody id="users-table-body">
                            {!isLoading && users.map((value: any) => (
                                <tr key={value.id}>
                                    <td data-label="Nome">{value.name}</td>
                                    <td data-label="Email">{value.email}</td>
                                    <td data-label="Tipo">{value.roles[0].name}</td>
                                    <td data-label=""><button onClick={() => navigate(`/configuracao/editar/${value.id}`)}>Editar</button></td>
                                    <td data-label=""><button onClick={() => {setIsClose(true); setId(value.id)}}>Apagar</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="voltar">
                    <button onClick={() => {navigate('/')}}>Voltar</button>
                </div>
            </div>

            {isLoading && <Loading />}

            {isClose && 
                <div id="delete" className="loading1">
                    <div className="close" onClick={() => setIsClose(false)}></div>
                    <div className="box">
                        <p>Deseja apagar esse usuário?</p>
                        <button onClick={() => deleteUser(id)}>Sim</button>
                        <button onClick={() => setIsClose(false)}>Não</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default Configuracao;