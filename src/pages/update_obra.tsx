/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components';

const UpdateObra: React.FC = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [company, setCompany] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [responsible, setResponsible] = useState('')
    const [observer, setObserver] = useState('')
    const [area, setArea] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState<any>('')
    const { id } = useParams()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        setToken(token)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }

        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/constructions/${id}`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
            setName(response.data.name)
            setCompany(response.data.company)
            setStart(response.data.start_in)
            setEnd(response.data.end_in)
            setResponsible(response.data.responsible_engineer)
            setObserver(response.data.observer)
            setArea(response.data.build_area)
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

    const editConstruction = () => {
        setIsLoading(true)
        const data = {
            name,
            company,
            start_in: start,
            end_in: end,
            responsible_engineer: responsible,
            observer,
            build_area: area
        }
        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/constructions/${id}`,
            method: 'PUT',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then(() => {
            alert('Obra editada com sucesso')
            navigate('/painel/obra')
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
                    alert(error.response.data.message
                        .replace('company', 'construtora')
                        .replace('start in', 'data de inicio')
                        .replace('end in', 'data de previsão de término')
                        .replace('responsible engineer', 'engenheiro responsável')
                        .replace('observer', 'observador')
                        .replace('build area', 'área construída'))
                    break;
            }
          })
    }

    return (
        <div className="container">
            <div className="content">
                <h1>Editar Obra</h1>
                <form>
                    <div className="data-observation">
                        <label htmlFor="construtora">Construtora:</label>
                        <input type="text" id="construtora" name="construtora" required value={company} onChange={(e) => {setCompany(e.target.value)}} />
                    </div>

                    <div className="data-observation">
                        <label htmlFor="obra">Nome da Obra:</label>
                        <input type="text" id="obra" name="obra" required value={name} onChange={(e) => {setName(e.target.value)}} />
                    </div>

                    <div className="data-observation">
                        <label htmlFor="data_inicio">Data de Início:</label>
                        <input type="date" id="data_inicio" name="data_inicio" required value={start} onChange={(e) => {setStart(e.target.value)}} />
                    </div>

                    <div className="data-observation">
                        <label htmlFor="data_termino">Data de Previsão de Término:</label>
                        <input type="date" id="data_termino" name="data_termino" required value={end} onChange={(e) => {setEnd(e.target.value)}} />
                    </div>

                    <div className="data-observation">
                        <label htmlFor="engenheiro">Engenheiro Responsável:</label>
                        <input type="text" id="engenheiro" name="engenheiro" required value={responsible} onChange={(e) => {setResponsible(e.target.value)}} />
                    </div>

                    <div className="data-observation">
                        <label htmlFor="observador">Observador:</label>
                        <input type="text" id="observador" name="observador" required value={observer} onChange={(e) => {setObserver(e.target.value)}} />
                    </div>

                    <div className="data-observation">
                        <label htmlFor="area_construida">Área Construída:</label>
                        <input type="text" id="area_construida" name="area_construida" required value={area} onChange={(e) => {setArea(e.target.value)}} />
                    </div>
                    
                </form>
                <div className="buttons2">
                    <button onClick={() => navigate('/painel/obra')}>Voltar</button>
                    <button onClick={editConstruction}>Editar</button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>

    );
}

export default UpdateObra;