/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components';
import { MdAttachMoney } from "react-icons/md";

const Dashboard: React.FC = () => {
    const [report, setReport] = useState<any>([])
    const [dashboard, setDashboard] = useState<any>([])
    const [isLoading,setIsLoading] = useState(true)
    const {workId, constructionId} = useParams()
    const navigate = useNavigate()

    const transformDate = (value:string) => {
        if(value) {
          const date = value.split('-')
          return `${date[2]}/${date[1]}/${date[0]}`
        }
      }

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        const params = {
            construction_id: constructionId,
            work_stage_id: workId
        }

        if(!token) {
            navigate('/login')
            localStorage.clear()
        }

        Promise.all([axios.request({
            url: 'https://rup.lazaro-dev.online/public/api/v1/secure/report',
            method: 'GET',
            params,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }),
          axios.request({
            url: 'https://rup.lazaro-dev.online/public/api/v1/secure/dashboard',
            method: 'GET',
            params,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          })]).then((response) => {
            setReport(response[0].data)
            setDashboard(response[1].data)
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
    
    return (
        <div className="container">
            <div className="content">
                <h1>Relatorio da obra {report?.construction?.name}</h1>
                <div className="data-info">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Construtora</th>
                                <th>Obra</th>
                                <th>Etapa</th>
                                <th>Engenheiro</th>
                                <th>Observador</th>
                                <th>Área</th>
                                <th>Unidade</th>
                                <th>Início</th>
                                <th>Fim(previsão)</th>
                            </tr>
                        </thead>
                
                        <tbody id="users-table-body">
                            {!isLoading && (
                                <tr>
                                    <td data-label="Construtora">{report?.construction?.company}</td>
                                    <td data-label="Obra">{report?.construction?.name}</td>
                                    <td data-label="Etapa">{report?.work_stage?.name}</td>
                                    <td data-label="Engenheiro">{report?.construction?.responsible_engineer}</td>
                                    <td data-label="Observador">{report?.construction?.observer}</td>
                                    <td data-label="Área">{report?.construction?.build_area}</td>
                                    <td data-label="Unidade">{report?.work_stage?.work_stage_type?.unit_measurement}</td>
                                    <td data-label="Início">{transformDate(report?.construction?.start_in)}</td>
                                    <td data-label="Fim(previsão)">{report?.construction?.end_in ? transformDate(report?.construction?.end_in) : 'Obra em andamento'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="data-info">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Dia</th>
                                <th>Qt. de homens</th>
                                <th>Jornada</th>
                                <th>Hh</th>
                                <th>Qt. de serviço({report?.work_stage?.work_stage_type?.unit_measurement})</th>
                                <th>Hh CUM</th>
                                <th>RUP DIÁRIA</th>
                                <th>RUP CUM</th>
                                <th>{`DIÁRIA < CUM`}</th>
                                <th>RUP POT</th>
                                <th>Observações</th>
                                <th>Clima</th>
                            </tr>
                        </thead>
                
                        <tbody id="users-table-body">
                            {!isLoading && report?.work_stage.stages.map((value: any) => (
                                <tr key={value.id}>
                                    <td data-label="Dia">{transformDate(value.observation_date)}</td>
                                    <td data-label="Qt. de homens">{value.number_men}</td>
                                    <td data-label="Jornada">{value.work_hours}</td>
                                    <td data-label="Hh">{value.Hh}</td>
                                    <td data-label={`Qt. de serviço(${report?.work_stage?.work_stage_type?.unit_measurement})`}>{value.quantity_service}</td>
                                    <td data-label="Hh CUM">{value.Hh_cumulativo}</td>
                                    <td data-label="RUP DIÁRIA">{value.rup_diaria}</td>
                                    <td data-label="RUP CUM">{value.rup_cumulativa}</td>
                                    <td data-label="DIÁRIA < CUM">{value.rup_diaria_menor_rup_cumulativa}</td>
                                    <td data-label="RUP POT">{value.rup_potencial}</td>
                                    <td data-label="Observações">{value.observation}</td>
                                    <td data-label="Clima">{value.climate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h1>Dashboard</h1>

                {!isLoading && (
                    <div className='Report__info'>
                        <div className='Report__card'>
                            <div className='Report__box'>
                            <h2 className='Report__title'>{dashboard?.general?.melhor_rup_cumulativa}</h2>
                            <p className='Report__paragh'>Melhor rup cumulativa</p>
                            </div>
                            <MdAttachMoney className='Report__favicon'/>
                        </div>

                        <div className='Report__card'>
                            <div className='Report__box'>
                            <h2 className='Report__title'>{dashboard?.general?.melhor_rup_diaria}</h2>
                            <p className='Report__paragh'>Melhor rup diaria</p>
                            </div>
                            <MdAttachMoney className='Report__favicon'/>
                        </div>

                        <div className='Report__card'>
                            <div className='Report__box'>
                            <h2 className='Report__title'>{dashboard?.general?.percent_produtividade}%</h2>
                            <p className='Report__paragh'>Porcentagem produtividade</p>
                            </div>
                            <MdAttachMoney className='Report__favicon'/>
                        </div>

                        <div className='Report__card'>
                            <div className='Report__box'>
                            <h2 className='Report__title'>{dashboard?.general?.pior_rup_cumulativa}</h2>
                            <p className='Report__paragh'>Pior rup cumulativa</p>
                            </div>
                            <MdAttachMoney className='Report__favicon'/>
                        </div>

                        <div className='Report__card'>
                            <div className='Report__box'>
                            <h2 className='Report__title'>{dashboard?.general?.pior_rup_diaria}</h2>
                            <p className='Report__paragh'>Pior rup diaria</p>
                            </div>
                            <MdAttachMoney className='Report__favicon'/>
                        </div>
                    </div>
                )}
                            
                <div className="voltar">
                    <button onClick={() => {navigate('/')}}>Voltar</button>
                </div>
            </div>

            {isLoading && <Loading />}
        </div>
    );
}

export default Dashboard;