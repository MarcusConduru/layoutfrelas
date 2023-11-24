/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components';

const UpdateEstagio: React.FC = () => {
    const navigate = useNavigate()
    const [date, setDate] = useState('')
    const [men, setMen] = useState('')
    const [hour, setHour] = useState('')
    const [service, setService] = useState('')
    const [observation, setObservation] = useState('')
    const [climate, setClimate] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState<any>('')
    const { id, item } = useParams()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }
        setToken(token)

        axios.request({
            url: `https://api.irup.online/public/api/v1/secure/stages/${id}`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
            setDate(response.data.observation_date)
            setMen(response.data.number_men)
            setHour(response.data.work_hours)
            setService(response.data.quantity_service)
            setObservation(response.data.observation)
            setClimate(response.data.climate)
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

    const EditStage = () => {
        setIsLoading(true)
        const data = {
            observation_date: date,
            number_men: men,
            work_hours: hour,
            quantity_service: service,
            observation: observation,
            climate: climate
        }
        axios.request({
            url: `https://api.irup.online/public/api/v1/secure/stages/${id}`,
            method: 'PUT',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then(() => {
            alert('Estagio alterado com sucesso')
            navigate(`/painel/estagio/${item}`)
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
                <h1>Editar Estagio</h1>
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
                    <button onClick={() => navigate(`/painel/estagio/${item}`)}>Voltar</button>
                    <button onClick={EditStage}>Salvar</button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>

    );
}

export default UpdateEstagio;