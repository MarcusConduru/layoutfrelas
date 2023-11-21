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
    const [isClose,setIsClose] = useState(false)
    const [id, setId] = useState('')
    const [status, setStatus] = useState('')

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
    }, [isChange])

    const changeStatus = () => {
        const data = {
            status: status === 'PROGRESS' ? 'FINISH' : 'PROGRESS'
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
                <h1>Lista de Obras</h1>
                <div className="data-info">
                    {token?.user?.roles[0].name !== 'Visualizador' && (
                        <div className="data">
                            <button onClick={() => navigate('/painel/obra/nova')}>Criar Obra</button>
                        </div>
                    )}
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Construtora</th>
                                <th>Status</th>
                                {token?.user?.roles[0].name !== 'Visualizador' && (
                                    <>
                                        <th></th>
                                        <th></th>
                                    </>
                                )}
                            </tr>
                        </thead>
                
                        <tbody  id="users-table-body">
                            {!isLoading && constructions.map((value: any) => (
                                <tr key={value.id}>
                                    <td data-label="Nome">{value.name}</td>
                                    <td data-label="Construtora">{value.company}</td>
                                    <td style={{ color: value.status === 'PROGRESS' ? '#da2320' : '#16921c' }}>{value.status === 'PROGRESS' ? 'Em andamento' : 'Finalizado'}</td>
                                    {token?.user?.roles[0].name !== 'Visualizador' && (
                                        <>
                                            <td data-label=""><button onClick={() => navigate(`/painel/obra/editar/${value.id}`)}>Editar</button></td>
                                            <td data-label="Status"><button disabled={token?.user?.roles[0].name !== 'Visualizador' ? false : true} onClick={() => {setIsClose(true); setId(value.id); setStatus(value.status)}}>{value.status === 'PROGRESS' ? 'Encerrar' : 'Encerrado'}</button></td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                
                {isClose && 
                    <div id="delete" className="loading1">
                        <div className="close" onClick={() => setIsClose(false)}></div>
                        <div className="box">
                            <p>Deseja encerrar essa obra?</p>
                            <button onClick={() => changeStatus()}>Sim</button>
                            <button onClick={() => setIsClose(false)}>Não</button>
                        </div>
                    </div>
                }


                <div className="voltar">
                    <button onClick={() => {navigate('/')}}>Voltar</button>
                </div>
            </div>

            {isLoading && <Loading />}
        </div>
    );
}

export default PainelObra;