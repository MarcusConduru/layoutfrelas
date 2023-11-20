import React, { useState } from 'react';

const CalculadoraEquipe: React.FC = () => {
    const [hour, setHour] = useState('')
    const [service, setService] = useState('')
    const [RUP, setRUP] = useState('')
    const [result, setResult] = useState('')

    function calcularEquipe() {        
    
        if (isNaN(parseFloat(hour)) || isNaN(parseFloat(service)) || isNaN(parseFloat(RUP))) {
            setResult("Preencha os campos corretamente")
        } else {
            const quantidadeHomens = Math.round((parseFloat(RUP) * parseFloat(service)) / parseFloat(hour));
            setResult(quantidadeHomens.toFixed(2) + ' homens necessários na equipe')
        }
    }
    
    function exportToCSV() {
    
        if (hour && service && RUP) {
            // Criação do conteúdo para o arquivo CSV
            const csvContent = `Hora Diária;Quantidade de Serviço;RUP Potencial;Etapa;Homens Necessários\n${hour};${service};${RUP};${result}`;
    
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
            <label htmlFor="etapa">Etapa:</label>
            <select id="etapa" onChange={() => {}}>
                    <option value="">Selecione a Etapa</option>
                    <option value="terraplanagem">Terraplanagem</option>
                    <option value="fundacao">Fundação</option>
                    <option value="estruturação_viga">Estruturação Viga</option>
                    <option value="estruturação_pilar">Estruturação Pilar</option>
                    <option value="estruturação_laje">Estruturação Laje</option>
                    <option value="alvenaria">Alvenaria</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="estrutura_metalica">Estrutura metálica</option>
                    <option value="estrutura_madeira">Estrutura em madeira</option>
                    <option value="instalacao_metalica">Instalação Elétrica</option>
                    <option value="instalacao_hidraulica">Instalação Hidráulica</option>
                    <option value="instalacao_esgoto">Instalação de Esgoto</option>
                    <option value="revestimento">Revestimento</option>
                    <option value="pintura">Pintura</option>
                    <option value="forro">Forro</option>
                    <option value="piso">Piso</option>
                    <option value="esquadria">Esquadria</option>
                    <option value="forros">Forros</option>
                    <option value="outro">Outro</option>
            </select>
            </div>
            <div id="outroEtapa" style={{display: 'none'}}>
                <label htmlFor="outro">Outra Etapa:</label>
                <input type="text" id="outro" placeholder="Digite a etapa"/>
            </div>
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
    </div>
  );
}

export default CalculadoraEquipe;