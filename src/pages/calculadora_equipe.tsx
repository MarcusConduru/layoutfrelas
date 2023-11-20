/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Loading } from '../components';
import { useNavigate } from 'react-router-dom';

const CalculadoraEquipe: React.FC = () => {
    const [hour, setHour] = useState('')
    const [service, setService] = useState('')
    const [RUP, setRUP] = useState('')
    const [result, setResult] = useState('')
    const [constructions, setConstructions] = useState<any>([])
    const [work, setWork] = useState<any>([])
    const [selectConstructions, setSelectConstructions] = useState('')
    const [selectWork, setSelectWork] = useState('')
    const [token, setToken] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        setToken(token)
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
                    case 440:
                        localStorage.clear()
                        navigate('/login')
                        break;
                    default:
                        alert(error.response.data.message)
                        break;
                }
            })
    }, [])

    const listWorks = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectConstructions(e.target.value)
        setIsLoading(true)
        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/constructions/${e.target.value}/work-stages`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
                setWork(response.data)
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
                        alert(error.response.data.message)
                        break;
                }
            })
    }

    function calcularEquipe() {        
        if (isNaN(parseFloat(hour)) || isNaN(parseFloat(service)) || isNaN(parseFloat(RUP))) {
            setResult("Preencha os campos corretamente")
        } else {
            const quantidadeHomens = Math.round((parseFloat(RUP) * parseFloat(service)) / parseFloat(hour));
            setResult(quantidadeHomens.toFixed(2) + ' homens necessários na equipe')
        }
    }
    
    function exportToCSV() {
        const etapa = work.filter((el: any) => el.id === Number(selectWork))
        if (hour && service && RUP) {
            // Criação do conteúdo para o arquivo CSV
            const csvContent = `Hora Diária;Quantidade de Serviço;RUP Potencial;Etapa;Homens Necessários\n${hour};${service};${RUP};${etapa[0].name};${result}`;
    
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'calculadora_equipe.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('A funcionalidade de download não é suportada pelo seu navegador.');
            }
        }
    }

    return (
    <div className="container">
        <h1>Calculadora de Equipe</h1>
        <div className="content">
            <div className="data-observation">
                <label htmlFor="select">Escolha uma obra:</label>
                <select defaultValue={'default'} id="select" onChange={listWorks}>
                    <option value='default' disabled>Escolha uma obra</option>
                    {constructions.map((value: any) => (
                        <option key={value.id} value={value.id}>{value.name}</option>
                    ))}
                </select>
            </div>
            {selectConstructions && (
                <div className="data-observation">
                    <label htmlFor="work">Escolha uma etapa:</label>
                    <select  defaultValue={'default'} id="work" onChange={(e) => setSelectWork(e.target.value)}>
                        <option value='default' disabled>Escolha uma etapa</option>
                        {work.map((value: any) => (
                            <option key={value.id} value={value.id}>{value.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="data-observation">
                <label htmlFor="hora-diaria">Hora Diária:</label>
                <input type="number" id="hora-diaria" value={hour} onChange={(e) => setHour(e.target.value)} placeholder="Insira as horas diárias"/>
            </div>

            <div className="data-observation">
                <label htmlFor="qt-servico">Qt. de Serviço:</label>
                <input type="number" id="qt-servico" value={service} onChange={(e) => setService(e.target.value)} placeholder="Insira a quantidade de serviço"/>
            </div>

            <div className="data-observation">
                <label htmlFor="rup-potencial">RUP Potencial:</label>
                <input type="number" id="rup-potencial" value={RUP} onChange={(e) => setRUP(e.target.value)} placeholder="Insira o RUP potencial"/>
            </div>

            <div className="buttons2">
                <button onClick={calcularEquipe}>Calcular</button>
                <button onClick={exportToCSV}>Salvar como CSV</button>
                <button onClick={() => {}}>Voltar</button>
            </div>

            <p className="result">Resultado: <span id="resultado">{result ? result : '--'}</span></p>
        </div>

        {isLoading && <Loading />}
    </div>
  );
}

export default CalculadoraEquipe;