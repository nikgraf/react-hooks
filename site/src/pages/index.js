import React from "react";
import styled from "styled-components";

import Layout from "../components/layout";
import hooks from "../../../hooks.json";

function compare(hookA, hookB) {
  if (hookA.name < hookB.name) return -1;
  if (hookA.name > hookB.name) return 1;
  return 0;
}

const sortedHooks = hooks.sort(compare);

const Hook = styled.div`
  margin-bottom: 3rem;
`;

const RepositoryLink = styled.a`
  float: right;
`;

const Pre = styled.pre`
  padding: 0.6rem;
`;

const Tag = styled.span`
  font-size: 0.8rem;
  background: #d9ffab;
  border-bottom: 1px solid #b6de86;
  padding: 0.5rem 0.8rem;
  border-radius: 1rem;
  margin-right: 0.5rem;
`;

const FilterInput = styled.input`
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 3rem;
  padding: 0.4rem 0.8rem;
  font-family: "Roboto", sans-serif;
`;

class IndexPage extends React.Component {
  state = { term: "" };

  render() {
    return (
      <Layout>
        <p style={{ marginTop: '3rem' }}>
          Warning: Hooks are currently a React
          <a href={"https://github.com/reactjs/rfcs/pull/68"}> RFC</a> and{" "}
          <strong>not ready for production</strong>.
        </p>
        <p>
          You can add your hooks by opening a pull-request at{" "}
          <a href={"https://github.com/nikgraf/react-hooks"}>
            https://github.com/nikgraf/react-hooks
          </a>
          .
        </p>
        <FilterInput
          value={this.state.term}
          onChange={({ target: { value } }) => {
            this.setState({ term: value });
          }}
          placeholder="filter by name"
        />
        {sortedHooks
          .filter(hook =>
            hook.name.toLowerCase().includes(this.state.term.toLowerCase())
          )
          .map(hook => (
            <Hook key={`${hook.repositoryUrl}-${hook.name}`}>
              <RepositoryLink href={hook.repositoryUrl}>
                {hook.repositoryUrl}
              </RepositoryLink>

              <h2>{hook.name}</h2>
              <Pre>
                <code>{hook.importStatement}</code>
              </Pre>
              <div>
                {hook.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </Hook>
          ))}
      </Layout>
    );
  }
}

export default IndexPage;
