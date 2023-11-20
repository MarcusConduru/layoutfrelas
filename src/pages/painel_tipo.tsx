/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components';

const PainelTipo: React.FC = () => {
    const [type, setType] = useState<any>([])
    const [isLoading,setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') as any)
        if(!token) {
            navigate('/login')
            localStorage.clear()
        }

        axios.request({
            url: 'https://rup.lazaro-dev.online/public/api/v1/secure/work-stage-types/all',
            method: 'GET',
            headers: {
              'authorization': `Bearer ${token.accessToken}`
            }
          }).then((response) => {
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
                    alert('Algo de errado aconteceu. Tente novamente mais tarde.')
                    break;
            }
          })
    }, [])
    return (
        <div className="container">
            <div className="content">
                <h1>Lista de tipos de etapa</h1>
                <div className="data-info">
                    <div className="data">
                        <button onClick={() => navigate('/painel/tipo/novo')}>Criar tipo de etapa</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Medida unitária</th>
                                <th></th>
                            </tr>
                        </thead>
                
                        <tbody  id="users-table-body">
                            {!isLoading && type.map((value: any) => (
                                <tr key={value.id}>
                                    <td data-label="Nome">{value.name}</td>
                                    <td data-label="Medida unitária">{value.unit_measurement}</td>
                                    <td data-label=""><button onClick={() => navigate(`/painel/tipo/editar/${value.id}`)}>Editar</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="voltar">
                    <button onClick={() => {navigate('/')}}>Voltar</button>
                </div>
            </div>

            {isLoading && <Loading />}
        </div>
    );
}

export default PainelTipo;