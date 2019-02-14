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

const Name = styled.h2`
  font-family: "Space Mono", monospace;
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
  padding: 0.4rem 0.8rem;
  font-family: "Roboto", sans-serif;
`;

const ResultsCount = styled.div`
  font-size: 0.7rem;
  color: grey;
  margin-top: 0.5rem;
  margin-bottom: 3rem;
`

class IndexPage extends React.Component {
  state = { term: "", results: sortedHooks };

  render() {
    const {term, results} = this.state

    return (
      <Layout>
        <p>
          You can add your hooks by opening a pull-request at{" "}
          <a href={"https://github.com/nikgraf/react-hooks"}>
            https://github.com/nikgraf/react-hooks
          </a>
          .
        </p>
        <FilterInput
          value={term}
          onChange={({ target: { value } }) => {
            this.setState({
              term: value,
              results: sortedHooks.filter(hook =>
                hook.name.toLowerCase().includes(value.toLowerCase()) ||
                value.toLowerCase()
                  .split(/[ ,]+/)
                  .filter(queryTag => queryTag !== '')
                  .every(queryTag =>
                    hook.tags.map(tag => tag.toLowerCase()).includes(queryTag)
                  )
              )
            });
          }}
          placeholder="filter by name or tag"
        />
        <ResultsCount>
          Found {results.length} {results.length === 1 ? 'entry' : 'entries'}
        </ResultsCount>
        {results.map(hook => (
            <Hook key={`${hook.repositoryUrl}-${hook.name}`}>
              <RepositoryLink href={hook.repositoryUrl}>
                {hook.repositoryUrl}
              </RepositoryLink>

              <Name>{hook.name}</Name>
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
