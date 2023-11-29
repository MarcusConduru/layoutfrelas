/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components';
import { FaChartBar } from "react-icons/fa";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { CSVLink } from "react-csv";
import LineChart from '../components/line-chart';

pdfMake.vfs = pdfFonts.pdfMake.vfs
export const transformDate = (value:string) => {
    if(value) {
      const date = value.split('-')
      return `${date[2]}/${date[1]}/${date[0]}`
    }
}

const Dashboard: React.FC = () => {
    const [table, setTable] = useState(true)
    const [report, setReport] = useState<any>([])
    const [dashboard, setDashboard] = useState<any>([])
    const [isLoading,setIsLoading] = useState(true)
    const [dd, setDD] = useState<any>()
    const [CSV, SetCSV] = useState([])
    const {workId, constructionId} = useParams()
    const navigate = useNavigate()
    
    const createPdf = () => {
        const pdfGenerator = pdfMake.createPdf(dd)
        pdfGenerator.download(`Relatório ${report?.construction?.name}`)
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
            url: 'https://api.irup.online/public/api/v1/secure/report',
            method: 'GET',
            params,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }),
          axios.request({
            url: 'https://api.irup.online/public/api/v1/secure/dashboard',
            method: 'GET',
            params,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          })]).then((response) => {
            setReport(response[0].data)
            setDashboard(response[1].data)
            const report = response[0].data?.work_stage?.stages.map((value: any) => {
                return (`${transformDate(value.observation_date)}*-${value.number_men}*-${value.work_hours}*-${value.Hh}*-${value.quantity_service}*-${value.Hh_cumulativo}*- ${value.Qs_cumulativo}*-${value.rup_diaria}*-${value.rup_cumulativa}*-${value.rup_diaria_menor_rup_cumulativa === null ? '0' : value.rup_diaria_menor_rup_cumulativa}*-${value.rup_potencial}*-${value.observation}*-${value.climate}`).split('*-')
            })


            const csv = response[0].data?.work_stage?.stages.map((value: any) => {
                return {
                    Dia: transformDate(value.observation_date),
                    QtDehomens: value.number_men,
                    Jornada: value.work_hours,
                    Hh: value.Hh,
                    QtdeServiço: value.quantity_service,
                    HhCUM: value.Hh_cumulativo,
                    QsCUM: value.Qs_cumulativo,
                    RUPDIÁRIA: value.rup_diaria,
                    RUPCUM: value.rup_cumulativa,
                    DIÁRIACUM: value.rup_diaria_menor_rup_cumulativa === null ? '0' : value.rup_diaria_menor_rup_cumulativa,
                    RUPPOT: value.rup_potencial,
                    Observações: value.observation,
                    Clima: value.climate,
                }
            })


            SetCSV(csv)

            setDD({
                content: [
                {text: `Relatório ${response[0].data?.construction?.name}`, style: 'header'},
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        body: [
                            [{text: 'Dia', style: 'tableHeader'}, {text: 'Qt. de homens', style: 'tableHeader'}, {text: 'Jornada', style: 'tableHeader'},  {text: 'Hh', style: 'tableHeader'},  {text: `Qt. de serviço(${response[0].data?.work_stage?.work_stage_type?.unit_measurement})`, style: 'tableHeader'},  {text: 'Hh CUM', style: 'tableHeader'}, {text: 'Qs CUM', style: 'tableHeader'},  {text: 'RUP DIÁRIA', style: 'tableHeader'}, {text: 'RUP CUM', style: 'tableHeader'}, {text: 'DIÁRIA < CUM', style: 'tableHeader'}, {text: 'RUP POT', style: 'tableHeader'}, {text: 'Observações', style: 'tableHeader'}, {text: 'Clima', style: 'tableHeader'}],
                            ...report,
                        ]
                    },
                    layout: {
                        hLineWidth: function (i: any, node: any) {
                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                        },
                        vLineWidth: function (i: any, node: any) {
                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                        },
                        hLineColor: function (i: any, node: any) {
                            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },
                        vLineColor: function (i: any, node: any) {
                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                        },
                    }
                }
                ],
                styles: {
                    tableExample: {
                        fontSize: 7,
                    },
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10],
                    }
                }
            })
            setIsLoading(false)
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
    }, [])
    
    return (
        <div className="container">
            <div className="content">
                <h1>Relatório da obra {report?.construction?.name}</h1>
                <div className="buttons">
                    <button onClick={createPdf} className='csv'>Gerar PDF</button>  
                    <CSVLink data={CSV} className='csv' filename={`Relatório ${report?.construction?.name}`}>
                        <button onClick={() => {}}>Gerar CSV</button>
                    </CSVLink>
                    <button onClick={() => setTable(!table)} className='csv'>Ver Valores</button>  
                </div>

                <div className="data-info">
                    <table className='table' style={{ tableLayout: table ? 'fixed' : 'auto' }}>
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
                    <table className='table' style={{ tableLayout: table ? 'fixed' : 'auto' }}>
                        <thead>
                            <tr>
                                <th className={table ? 'table__th' : ''}>Dia</th>
                                <th className={table ? 'table__th' : ''}>Qt. de homens</th>
                                <th className={table ? 'table__th' : ''}>Jornada</th>
                                <th className={table ? 'table__th' : ''}>Hh</th>
                                <th className={table ? 'table__th' : ''}>Qt. de serviço({report?.work_stage?.work_stage_type?.unit_measurement})</th>
                                <th className={table ? 'table__th' : ''}>Hh CUM</th>
                                <th className={table ? 'table__th' : ''}>Qs CUM</th>
                                <th className={table ? 'table__th' : ''}>RUP DIÁRIA</th>
                                <th className={table ? 'table__th' : ''}>RUP CUM</th>
                                <th className={table ? 'table__th' : ''}>{`DIÁRIA < CUM`}</th>
                                <th className={table ? 'table__th' : ''}>RUP POT</th>
                                <th className={table ? 'table__th' : ''}>Observações</th>
                                <th className={table ? 'table__th' : ''}>Clima</th>
                            </tr>
                        </thead>
                
                        <tbody id="users-table-body">
                            {!isLoading && report?.work_stage.stages.map((value: any) => (
                                <tr key={value.id}>
                                    <td className={table ? 'table__td' : ''} data-label="Dia">{transformDate(value.observation_date)}</td>
                                    <td className={table ? 'table__td' : ''} data-label="Qt. de homens">{value.number_men}</td>
                                    <td className={table ? 'table__td' : ''} data-label="Jornada">{value.work_hours}</td>
                                    <td className={table ? 'table__td' : ''} data-label="Hh">{value.Hh}</td>
                                    <td className={table ? 'table__td' : ''} data-label={`Qt. de serviço(${report?.work_stage?.work_stage_type?.unit_measurement})`}>{value.quantity_service}</td>
                                    <td className={table ? 'table__td' : ''} data-label="Hh CUM">{value.Hh_cumulativo}</td>
                                    <td className={table ? 'table__td' : ''} data-label="Qs CUM">{value.Qs_cumulativo}</td>
                                    <td className={table ? 'table__td' : ''} data-label="RUP DIÁRIA">{value.rup_diaria}</td>
                                    <td className={table ? 'table__td' : ''} data-label="RUP CUM">{value.rup_cumulativa}</td>
                                    <td className={table ? 'table__td' : ''} data-label="DIÁRIA < CUM">{value.rup_diaria_menor_rup_cumulativa}</td>
                                    <td className={table ? 'table__td' : ''} data-label="RUP POT">{value.rup_potencial}</td>
                                    <td className={table ? 'table__td' : ''} data-label="Observações">{value.observation}</td>
                                    <td className={table ? 'table__td' : ''} data-label="Clima">{value.climate}</td>
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
                            <FaChartBar className='Report__favicon'/>
                        </div>

                        <div className='Report__card'>
                            <div className='Report__box'>
                            <h2 className='Report__title'>{dashboard?.general?.melhor_rup_diaria}</h2>
                            <p className='Report__paragh'>Melhor rup diaria</p>
                            </div>
                            <FaChartBar className='Report__favicon'/>
                        </div>
                        
                        <div className='Report__card'>
                            <div className='Report__box'>
                            <h2 className='Report__title'>{dashboard?.general?.percent_produtividade}%</h2>
                            <p className='Report__paragh'>Delta RUP</p>
                            </div>
                            <FaChartBar className='Report__favicon'/>
                        </div>

                        <div className='Report__card'>
                            <div className='Report__box'>
                            <h2 className='Report__title'>{dashboard?.general?.pior_rup_cumulativa}</h2>
                            <p className='Report__paragh'>Pior rup cumulativa</p>
                            </div>
                            <FaChartBar className='Report__favicon'/>
                        </div>

                        <div className='Report__card'>
                            <div className='Report__box'>
                            <h2 className='Report__title'>{dashboard?.general?.pior_rup_diaria}</h2>
                            <p className='Report__paragh'>Pior rup diaria</p>
                            </div>
                            <FaChartBar className='Report__favicon'/>
                        </div>
                    </div>
                )}
                <div className="voltar">
                    <button onClick={() => navigate('/relatorio/tipo')}>Voltar</button>
                </div>
                            
            </div>
            <LineChart data={dashboard} />
            {isLoading && <Loading />}
        </div>
    );
}

export default Dashboard;