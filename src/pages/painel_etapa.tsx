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
    const [isStage,setIsStage] = useState(false)
    const [ids, setIds] = useState('')
    const [status, setStatus] = useState('')
    const [construction, setConstruction] = useState('')
    const [stageId, setStageId] = useState('')

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        setToken(token)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }
        
        Promise.all([axios.request({
            url: `https://api.irup.online/public/api/v1/secure/constructions/${id}/work-stages`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }),
          axios.request({
            url: `https://api.irup.online/public/api/v1/secure/constructions/${id}`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          })])
        .then((response) => {
            setConstruction(response[1].data.status)
            setStage(response[0].data)
            setIsLoading(false)
          }).catch((error) => {
            setIsLoading(false)
            switch (error.response.status) {  
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

    const deleteStage = () => {
        setIsLoading(true)
        axios.request({
            url: `https://api.irup.online/public/api/v1/secure/work-stages/${ids}`,
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
                case 440:
                    alert('Token de acesso expirado.')
                    localStorage.clear()
                    navigate('/login')
                    break;
                default:
                    alert('Algo de errado aconteceu. Tente novamente mais tarde.')
                    break;
            }
          })
    }

    const changeStatus = () => {
        const data = {
            status: status === 'PROGRESS' ? 'FINISH' : 'PROGRESS'
        }
        setIsLoading(true)
        axios.request({
            url: `https://api.irup.online/public/api/v1/secure/work-stages/${stageId}/handle-status`,
            method: 'PUT',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then(() => {
            setIsStage(false)
            setIsChange(!isChange)
          }).catch((error) => {
            setIsLoading(false)
            setIsStage(false)
            switch (error.response.status) {  
                case 440:
                    alert('Token de acesso expirado.')
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
                <h1>Gerenciamento RUP</h1>
                <div className="data-info">
                    {token?.user?.roles[0].name !== 'Visualizador' && (
                        <div className="data">
                            <button disabled={construction === 'PROGRESS' ? false : true} onClick={() => navigate(`/painel/etapa/${id}/novo`)}>Criar Etapa</button>
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
                                        <th>Observações diárias</th>
                                        <th></th>
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
                                    <td style={{ color: value.status === 'PROGRESS' ? '#da2320' : '#16921c' }}>{value.status === 'PROGRESS' ? 'Em andamento' : 'Finalizado'}</td>
                                    {token?.user?.roles[0].name !== 'Visualizador' && (
                                        <>
                                            <td><button onClick={() => navigate(`/painel/estagio/${value.id}/${value.name.replace(' ', '')}/${id}`)}>Alimentar</button></td>
                                            <td><button onClick={() => navigate(`/painel/etapa/editar/${value.id}`)}>Editar</button></td>
                                            <td><button disabled={value.status === 'PROGRESS' ? false : true} onClick={() => {setIsStage(true); setStatus(value.status); setStageId(value.id)}}>{value.status === 'PROGRESS' ? 'Encerrar' : 'Encerrado'}</button></td>
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
                        <p>Deseja apagar essa etapa?</p>
                        <button onClick={() => deleteStage()}>Sim</button>
                        <button onClick={() => setIsClose(false)}>Não</button>
                    </div>
                </div>
            }

            {isStage && 
                <div id="delete" className="loading1">
                    <div className="close" onClick={() => setIsStage(false)}></div>
                    <div className="box">
                        <p>Deseja encerrar essa etapa?</p>
                        <button onClick={() => changeStatus()}>Sim</button>
                        <button onClick={() => setIsStage(false)}>Não</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default PainelEtapa;