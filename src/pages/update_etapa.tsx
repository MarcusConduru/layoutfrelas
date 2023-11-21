/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components';

const UpdateEtapa: React.FC = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState<any>('')
    const [type, setType] = useState<any>([])
    const [select, setSelect] = useState<any>()
    const [status, setStatus] = useState()
    const { id } = useParams()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }
        setToken(token)
        Promise.all([
            axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/work-stage-types/all`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }}),
            axios.request({
                url: `https://rup.lazaro-dev.online/public/api/v1/secure/work-stages/${id}`,
                method: 'GET',
                headers: {
                  'authorization': `Bearer ${token.accessToken}`
                }
            })
        ])
        .then((response) => {
            setType(response[0].data)
            setName(response[1].data.name)
            setSelect(response[1].data.work_stage_type.id)
            setStatus(response[1].data.status)
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

    const NewStage = () => {
        setIsLoading(true)
        const data = {
            name,
            work_stage_type_id: select,
            status
        }
        axios.request({
            url: `https://rup.lazaro-dev.online/public/api/v1/secure/work-stages/${id}`,
            method: 'PUT',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then(() => {
            alert('Etapa criado com sucesso')
            navigate(-1)
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

    return (
        <div className="container">
            <div className="content">
                <h1>Editar Etapa</h1>
                <form>
                <div className="data-observation">
                        <label htmlFor="construtora">Nome da etapa:</label>
                        <input type="text" id="construtora" name="construtora" required value={name} onChange={(e) => {setName(e.target.value)}} />
                    </div>
                    <div className="data-observation">
                        <label htmlFor="select">Escolha um tipo de etapa:</label>
                        {select && (
                            <select id="select" defaultValue={select} onChange={(e) => setSelect(e.target.value)}>
                                {type.map((value: any) => (
                                    <option key={value.id} value={value.id}>{value.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </form>
                <div className="buttons2">
                    <button onClick={() => navigate(-1)}>Voltar</button>
                    <button onClick={NewStage}>Salavr</button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>

    );
}

export default UpdateEtapa;