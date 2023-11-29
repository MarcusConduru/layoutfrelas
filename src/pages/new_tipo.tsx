/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components';

const NewTipo: React.FC = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [measure, setMeasure] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState<any>('')

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
            name,
            unit_measurement: measure
        }
        axios.request({
            url: `https://api.irup.online/public/api/v1/secure/work-stage-types`,
            method: 'POST',
            data,
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then(() => {
            alert('Tipo de etapa criado com sucesso')
            navigate(`/painel/tipo`)
          }).catch((error) => {
            setIsLoading(false)
            switch (error.response.status) {  
                case 440:
                    alert('Token de acesso expirado.')
                    localStorage.clear()
                    navigate('/login')
                    break;
                default:
                    alert(error.response.data.message.replace('unit measurement', 'medida unitária'))
                    break;
            }
          })
    }

    return (
        <div className="container">
            <div className="content">
                <h1>Criar tipo de etapa</h1>
                <form>
                    <div className="data-observation">
                        <label htmlFor="construtora">Nome do tipo da etapa:</label>
                        <input type="text" id="construtora" name="construtora" required value={name} onChange={(e) => {setName(e.target.value)}} />
                    </div>
                    <div className="data-observation">
                        <label htmlFor="construtora">medida unitária:</label>
                        <input type="text" id="medida" name="medida" required value={measure} onChange={(e) => {setMeasure(e.target.value)}} />
                    </div>
                </form>
                <div className="buttons2">
                    <button onClick={() => navigate('/painel/tipo')}>Voltar</button>
                    <button onClick={NewStage}>Criar</button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>

    );
}

export default NewTipo;