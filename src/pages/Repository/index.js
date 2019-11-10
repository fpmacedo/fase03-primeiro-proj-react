import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import api from '../../services/api';
import Container from '../../components/Container';

import {
  Loading,
  Owner,
  IssuesList,
  IssuesFilter,
  SelectFilter,
  PageButton,
  PageActions,
} from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    page: 1,
    repository: {},
    issues: [],
    loading: true,
    FilterIndex: 0,
    states: [
      { state: 'open', label: 'Aberto' },
      { state: 'closed', label: 'Fechado' },
      { state: 'all', label: 'Todos' },
    ],
  };

  async componentDidMount() {
    const { match } = this.props;

    const { states, FilterIndex, page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: states[FilterIndex].state,
          per_page: 5,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleSelectChange = async e => {
    const { states } = this.state;
    await this.setState({
      FilterIndex: states.findIndex(s => s.state === e.target.value),
    });
    this.loadIssues();
  };

  handlePage = async action => {
    const { page } = this.state;
    await this.setState({
      page: action === 'back' ? page - 1 : page + 1,
    });
    this.loadIssues();
  };

  loadIssues = async () => {
    const { match } = this.props;

    const { states, FilterIndex, page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: states[FilterIndex].state,
          per_page: 5,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  };

  render() {
    const { repository, issues, loading, states, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositorios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssuesList>
          <PageActions>
            <h1>Pagina: {page}</h1>
            <PageButton
              type="button"
              disabled={page < 2}
              onClick={() => this.handlePage('back')}
            >
              <FaChevronLeft color="#FFF" size={14} />
            </PageButton>

            <PageButton type="button" onClick={() => this.handlePage('next')}>
              <FaChevronRight color="#FFF" size={14} />
            </PageButton>
          </PageActions>
          <IssuesFilter>
            <h1>Estado:</h1>
            <SelectFilter name="select" onChange={this.handleSelectChange}>
              {states.map(state => (
                <option key={String(state.label)} value={state.state}>
                  {state.label}
                </option>
              ))}
            </SelectFilter>
          </IssuesFilter>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
      </Container>
    );
  }
}
