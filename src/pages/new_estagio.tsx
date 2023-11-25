/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components';

const NewEstagio: React.FC = () => {
    const navigate = useNavigate()
    const [date, setDate] = useState('')
    const [men, setMen] = useState('')
    const [hour, setHour] = useState('')
    const [service, setService] = useState('')
    const [observation, setObservation] = useState('')
    const [climate, setClimate] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState<any>('')
    const { id, item, name } = useParams()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }
        setToken(token)
    }, [])

    const NewStage = () => {
        setIsLoading(true)
        const data = {
            observation_date: date,
            number_men: men,
            work_hours: Number(hour.replace(',', '.')),
            quantity_service: Number(service.replace(',', '.')),
            observation: observation,
            climate: climate
        }
        axios.request({
            url: `https://api.irup.online/public/api/v1/secure/work-stages/${id}/stages`,
            method: 'POST',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then(() => {
            alert('Estagio criado com sucesso')
            navigate(`/painel/estagio/${item}/${name}/${id}`)
          }).catch((error) => {
            setIsLoading(false)
            switch (error.response.status) {  
                // case 404:
                //     localStorage.clear()
                //     navigate('/login')
                //     break;
                // case 440:
                //     localStorage.clear()
                //     navigate('/login')
                //     break;
                default:
                    alert(
                        error.response.data.message
                        .replace('observation date', 'data de observação')
                        .replace('number men', 'quantidade de homens')
                        .replace('work hours', 'horas de trabalho')
                        .replace('quantity service', 'quantidade de serviços')
                        .replace('observation', 'observação')
                        .replace('climate', 'clima')
                    )
                    break;
            }
          })
    }

    return (
        <div className="container">
            <div className="content">
                <h1>Criar Observação Diária</h1>
                <form>
                    <div className="data-observation">
                        <label htmlFor="observation_date">Data de observação:</label>
                        <input type="date" id="observation_date" name="observation_date" required value={date} onChange={(e) => {setDate(e.target.value)}} />
                    </div>
                    <div className="data-observation">
                        <label htmlFor="number_men">Quantidade de homens:</label>
                        <input type="text" id="number_men" name="number_men" required value={men} onChange={(e) => {setMen(e.target.value)}} />
                    </div>
                    <div className="data-observation">
                        <label htmlFor="work_hours">Horas de trabalho:</label>
                        <input type="text" id="work_hours" name="work_hours" required value={hour} onChange={(e) => {setHour(e.target.value)}} />
                    </div>
                    <div className="data-observation">
                        <label htmlFor="quantity_service">Quantidade de serviços:</label>
                        <input type="text" id="quantity_service" name="quantity_service" required value={service} onChange={(e) => {setService(e.target.value)}} />
                    </div>
                    <div className="data-observation">
                        <label htmlFor="observation">Observação:</label>
                        <input type="text" id="quantity_sobservationervice" name="quantity_service" required value={observation} onChange={(e) => {setObservation(e.target.value)}} />
                    </div>
                    <div className="data-observation">
                        <label htmlFor="climate">Clima:</label>
                        <input type="text" id="climate" name="climate" required value={climate} onChange={(e) => {setClimate(e.target.value)}} />
                    </div>
                </form>
                <div className="buttons2">
                    <button onClick={() => navigate(`/painel/estagio/${id}`)}>Voltar</button>
                    <button onClick={NewStage}>Criar</button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>

    );
}

export default NewEstagio;