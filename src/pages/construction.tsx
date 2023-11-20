/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Loading } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Construction: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [constructions, setConstructions] = useState<any>([])
    const [select, setSelect] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
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

    return (
        <div className="container">
            <div className="content">
                <h1>Etapas da Obra</h1>
                <div className="data-info">
                    <div className="data-observation">
                        <label htmlFor="select">Escolha uma obra:</label>
                        <select id="select" defaultValue={'default'} onChange={(e) => setSelect(e.target.value)}>
                            <option value='default' disabled>Escolha uma obra</option>
                            {constructions.map((value: any) => (
                                <option key={value.id} value={value.id}>{value.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="save-button">
                        <button disabled={!select} onClick={() => {navigate(`/painel/etapa/${select}`)}}>Ver Etapas</button>
                    </div>
                </div>

                <div className="voltar">
                    <button onClick={() => {navigate('/')}}>Voltar</button>
                </div>
            </div>

            {isLoading && <Loading />}
        </div>
    );
}

export default Construction;