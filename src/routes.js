import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from './pages/Main';
import Repository from './pages/Repository';

export default function Routes() {
  return (
    // BrowserRouter serve para deixar tudo roteado
    <BrowserRouter>
      {/* Switch server para que possamos alternar entre as rotas */}
      <Switch>
        {/* chamando as rotas com os componentes, o exact serve para
        identificar as rotas e poder distingui-las exatamente */}
        <Route path="/" exact component={Main} />
        <Route path="/repository/:repository" component={Repository} />
      </Switch>
    </BrowserRouter>
  );
}
