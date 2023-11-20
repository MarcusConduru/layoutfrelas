/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Loading } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Relatorio: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [constructions, setConstructions] = useState<any>([])
    const [work, setWork] = useState<any>([])
    const [selectConstructions, setSelectConstructions] = useState('')
    const [selectWork, setSelectWork] = useState('')
    const [token, setToken] = useState<any>()
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

    return (
        <div className="container">
            <div className="content">
                <h1>Relatório</h1>
                <div className="data-info">
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
                    <div className="save-button">
                        <button disabled={!selectConstructions || !selectWork} onClick={() => {navigate(`/relatorio/obra/${selectConstructions}/etapa/${selectWork}`)}}>Ver Relatório</button>
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

export default Relatorio;