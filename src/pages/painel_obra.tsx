/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components';

const PainelObra: React.FC = () => {
    const [constructions, setConstructions] = useState<any>([])
    const [isLoading,setIsLoading] = useState(true)
    const [isChange, setIsChange] = useState(false)
    const navigate = useNavigate()
    const [token, setToken] = useState<any>('')

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        setToken(token)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }

        axios.request({
            url: 'https://rup.lazaro-dev.online/public/api/v1/secure/constructions/all',
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
            setConstructions(response.data)
            setIsLoading(false)
          }).catch((error) => {
            setIsLoading(false)
            switch (error.response.status) {  
                case 404:
                    localStorage.clear()
                    navigate('/login')
                    break;
                default:
                    alert('Algo de errado aconteceu. Tente novamente mais tarde.')
                    break;
            }
          })
    }, [isChange])

    const changeStatus = (id: string, status: string) => {
        const data = {
            status: status === 'PROGRESS' ? 'FINISHED' : 'PROGRESS'
        }
        setIsLoading(true)
        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/constructions/${id}/handle-status`,
            method: 'PUT',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then(() => {
            setIsChange(!isChange)
          }).catch((error) => {
            setIsLoading(false)
            switch (error.response.status) {  
                case 404:
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
                <h1>Lista de Obras</h1>
                <div className="data-info">
                    <div className="data">
                        <button onClick={() => navigate('/painel/obra/nova')}>Criar Obra</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Construtora</th>
                                <th>Status</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                
                        <tbody  id="users-table-body">
                            {!isLoading && constructions.map((value: any) => (
                                <tr key={value.id}>
                                    <td>{value.name}</td>
                                    <td>{value.company}</td>
                                    <td><button onClick={() => changeStatus(value.id, value.status)}>{value.status}</button></td>
                                    <td><button onClick={() => navigate(`/painel/obra/editar/${value.id}`)}>Editar</button></td>
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
        </div>
    );
}

export default PainelObra;