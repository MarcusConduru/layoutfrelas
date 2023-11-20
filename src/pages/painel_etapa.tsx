/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components';

const PainelEtapa: React.FC = () => {
    const [stage, setStage] = useState<any>([])
    const [isLoading,setIsLoading] = useState(true)
    const navigate = useNavigate()
    const { id } = useParams()
    const [isChange, setIsChange] = useState(false)
    const [token, setToken] = useState<any>('')
    const [isClose,setIsClose] = useState(false)
    const [ids, setIds] = useState('')

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        setToken(token)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }

        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/constructions/${id}/work-stages`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
            console.log(response.data)
            setStage(response.data)
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

    const deleteStage = (id: string) => {
        setIsLoading(true)
        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/work-stages/${id}`,
            method: 'DELETE',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
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

    const changeStatus = (id: string, status: string) => {
        const data = {
            status: status === 'PROGRESS' ? 'FINISH' : 'PROGRESS'
        }
        setIsLoading(true)
        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/work-stages/${id}/handle-status`,
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
                <h1>Lista de Etapas</h1>
                <div className="data-info">
                    {token?.user?.roles[0].name !== 'Visualizador' && (
                        <div className="data">
                            <button onClick={() => navigate(`/painel/etapa/${id}/novo`)}>Criar Etapa</button>
                        </div>
                    )}
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Tipo de etapa</th>
                                <th>Status</th>
                                {token?.user?.roles[0].name !== 'Visualizador' && (
                                    <>
                                        <th>Estagios</th>
                                        <th></th>
                                    </>
                                )}
                                {token?.user?.roles[0].name === 'Administrador' && (
                                    <th></th>
                                )}
                            </tr>
                        </thead>
                
                        <tbody  id="users-table-body">
                            {!isLoading && stage.map((value: any) => (
                                <tr key={value.id}>
                                    <td>{value.name}</td>
                                    <td>{value.work_stage_type.name}</td>
                                    <td><button disabled={token?.user?.roles[0].name !== 'Visualizador' ? false : true} onClick={() => changeStatus(value.id, value.status)}>{value.status === 'PROGRESS' ? 'Em andamento' : 'Finalizado'}</button></td>
                                    {token?.user?.roles[0].name !== 'Visualizador' && (
                                        <>
                                            <td><button onClick={() => navigate(`/painel/estagio/${value.id}`)}>Ver</button></td>
                                            <td><button onClick={() => navigate(`/painel/etapa/editar/${value.id}`)}>Editar</button></td>
                                        </>
                                    )}
                                    {token?.user?.roles[0].name === 'Administrador' && (
                                        <td><button onClick={() => {setIsClose(true); setIds(value.id)}}>Apagar</button></td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="voltar">
                    <button onClick={() => {navigate('/painel/etapa/obra')}}>Voltar</button>
                </div>
            </div>

            {isLoading && <Loading />}

            {isClose && 
                <div id="delete" className="loading1">
                    <div className="close" onClick={() => setIsClose(false)}></div>
                    <div className="box">
                        <p>Deseja apagar esse usuário?</p>
                        <button onClick={() => deleteStage(ids)}>Sim</button>
                        <button onClick={() => setIsClose(false)}>Não</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default PainelEtapa;