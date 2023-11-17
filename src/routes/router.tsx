import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Configuracao, Login, Menu, NewConfiguracao, UpdateConfiguracao } from '../pages';


const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Menu />} />
        <Route path='/configuracao' element={<Configuracao />} />
        <Route path='/configuracao/editar/:id' element={<UpdateConfiguracao />} />
        <Route path='/configuracao/novo' element={<NewConfiguracao />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;