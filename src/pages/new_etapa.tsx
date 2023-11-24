/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components';

const NewEtapa: React.FC = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState<any>('')
    const [type, setType] = useState<any>([])
    const [select, setSelect] = useState<any>()
    const { id } = useParams()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }
        setToken(token)
        axios.request({
            url: `https://api.irup.online/public/api/v1/secure/work-stage-types/all`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
            setSelect(response.data[0].id)
            setType(response.data)
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
            work_stage_type_id: select
        }
        axios.request({
            url: `https://api.irup.online/public/api/v1/secure/constructions/${id}/work-stages`,
            method: 'POST',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then(() => {
            alert('Etapa criado com sucesso')
            navigate(`/painel/etapa/${id}`)
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
                <h1>Criar etapa</h1>
                <form>
                    <div className="data-observation">
                        <label htmlFor="construtora">Nome da etapa:</label>
                        <input type="text" id="construtora" name="construtora" required value={name} onChange={(e) => {setName(e.target.value)}} />
                    </div>
                    <div className="data-observation">
                        <label htmlFor="select">Escolha um tipo de etapa:</label>
                        <select id="select" defaultValue={'default'} onChange={(e) => setSelect(e.target.value)}>
                            {type.map((value: any) => (
                                <option key={value.id} value={value.id}>{value.name}</option>
                            ))}
                        </select>
                    </div>
                </form>
                <div className="buttons2">
                    <button onClick={() => navigate(`/painel/etapa/${id}`)}>Voltar</button>
                    <button onClick={NewStage}>Criar</button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>

    );
}

export default NewEtapa;