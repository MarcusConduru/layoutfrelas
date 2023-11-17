import React from 'react';

const CadastroObra: React.FC = () => {
    return (
        <div className="container">
        <div className="top-bar">
            <div className="help">Ajuda</div>
            <div className="user">Usuário1344</div>
        </div>
        <div className="content">
            <h1>Cadastro de Obra</h1>
            <form>
                <div className="data-observation">
                    <label htmlFor="construtora">Construtora:</label>
                    <input type="text" id="construtora" name="construtora" required />
                </div>

                <div className="data-observation">
                    <label htmlFor="obra">Obra:</label>
                    <input type="text" id="obra" name="obra" required />
                </div>

                <div className="data-observation">
                    <label htmlFor="data_inicio">Data de Início:</label>
                    <input type="date" id="data_inicio" name="data_inicio" required />
                </div>

                <div className="data-observation">
                    <label htmlFor="data_termino">Data de Previsão de Término:</label>
                    <input type="date" id="data_termino" name="data_termino" required />
                </div>

                <div className="data-observation">
                    <label htmlFor="engenheiro">Engenheiro Responsável:</label>
                    <input type="text" id="engenheiro" name="engenheiro" required />
                </div>

                <div className="data-observation">
                    <label htmlFor="observador">Observador:</label>
                    <input type="text" id="observador" name="observador" required />
                </div>

                <div className="data-observation">
                    <label htmlFor="area_construida">Área Construída:</label>
                    <input type="text" id="area_construida" name="area_construida" required />
                </div>

                <div className="data-observation">
                    <label htmlFor="etapa_obra">Etapa da Obra:</label>
                    <input type="text" id="etapa_obra" name="etapa_obra" required />
                </div>
                
                <div className="buttons2">
                    <button>Voltar</button>
                    <button>Avançar</button>
                </div>
            </form>
        </div>
    </div>

    );
}

export default CadastroObra;