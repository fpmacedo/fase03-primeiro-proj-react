import React, { Component } from 'react';
import { FaGithubAlt, FaPlus } from 'react-icons/fa';
import { Container, Form, SubmitButton } from './styles';
// importa os icones padrao do react

export default class Main extends Component {
  state = {
    newRepo: '',
  };

  render() {
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositorios
        </h1>
        <Form onSubmit={() => {}}>
          <input type="text" placeholder="Adicionar repositorio" />
          <SubmitButton disabled>
            <FaPlus color="#FFF" size={14} />
          </SubmitButton>
        </Form>
      </Container>
    );
  }
}
