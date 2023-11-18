import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CadastroObra, Configuracao, Construction, EditStage, Login, Menu, NewConfiguracao, NewEstagio, NewEtapa, NewTipo, PainelEstagio, PainelEtapa, PainelObra, PainelTipo, UpdateConfiguracao, UpdateEtapa, UpdateObra, UpdateTipo } from '../pages';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Menu />} />
        <Route path='/configuracao' element={<Configuracao />} />
        <Route path='/configuracao/editar/:id' element={<UpdateConfiguracao />} />
        <Route path='/configuracao/novo' element={<NewConfiguracao />} />
        <Route path='/painel/obra' element={<PainelObra />} />
        <Route path='/painel/obra/nova' element={<CadastroObra />} />
        <Route path='/painel/obra/editar/:id' element={<UpdateObra />} />
        <Route path='/painel/etapa/obra' element={<Construction />} />
        <Route path='/painel/etapa/:id' element={<PainelEtapa />} />
        <Route path='/painel/etapa/:id/' element={<PainelEtapa />} />
        <Route path='/painel/etapa/:id/novo' element={<NewEtapa />} />
        <Route path='/painel/etapa/editar/:id' element={<UpdateEtapa />} />
        <Route path='/painel/estagio/:id' element={<PainelEstagio />} />
        <Route path='/painel/estagio/novo/:id' element={<NewEstagio />} />
        <Route path='/painel/estagio/:item/editar/:id' element={<EditStage />} />
        <Route path='/painel/tipo' element={<PainelTipo />} />
        <Route path='/painel/tipo/novo' element={<NewTipo />} />
        <Route path='/painel/tipo/editar/:id' element={<UpdateTipo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;