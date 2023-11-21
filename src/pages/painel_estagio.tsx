/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components';
import { transformDate } from './dashboard';

const PainelEstagio: React.FC = () => {
    const [phase, setPhase] = useState<any>([])
    const [isLoading,setIsLoading] = useState(true)
    const [isChange, setIsChange] = useState(false)
    const navigate = useNavigate()
    const [token, setToken] = useState<any>('')
    const [isClose,setIsClose] = useState(false)
    const [ids, setIds] = useState('')
    const { id, item, name } = useParams()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        setToken(token)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }

        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/work-stages/${id}/stages`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
            setPhase(response.data)
            console.log(response.data)
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


    const deleteStage = (id: string) => {
        setIsLoading(true)
        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/stages/${id}`,
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
                default:
                    alert('Algo de errado aconteceu. Tente novamente mais tarde.')
                    break;
            }
          })
    }

    return (
        <div className="container">
            <div className="content">
                <h1>Observações Diárias</h1>
                <div className="data-info">
                    <div className="data">
                        <button onClick={() => navigate(`/painel/estagio/novo/${id}`)}>Criar Observação Diária</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome da etapa</th>
                                <th>Data de observação</th>
                                <th>Quantidade de Homens</th>
                                <th></th>
                                {token?.user?.roles[0].name === 'Administrador' && (
                                    <th></th>
                                )}
                            </tr>
                        </thead>
                
                        <tbody  id="users-table-body">
                            {!isLoading && phase.map((value: any) => (
                                <tr key={value.id}>
                                    <td>{name}</td>
                                    <td>{transformDate(value.observation_date)}</td>
                                    <td>{value.number_men}</td>
                                    <td><button onClick={() => navigate(`/painel/estagio/${id}/editar/${value.id}`)}>Editar</button></td>
                                    {token?.user?.roles[0].name === 'Administrador' && (
                                        <td><button onClick={() => {setIsClose(true); setIds(value.id)}}>Apagar</button></td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="voltar">
                    <button onClick={() => {navigate(`/painel/etapa/${item}`)}}>Voltar</button>
                </div>
            </div>

            {isLoading && <Loading />}
            {isClose && 
                <div id="delete" className="loading1">
                    <div className="close" onClick={() => setIsClose(false)}></div>
                    <div className="box">
                        <p>Deseja apagar essa Observação Diárias?</p>
                        <button onClick={() => deleteStage(ids)}>Sim</button>
                        <button onClick={() => setIsClose(false)}>Não</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default PainelEstagio;