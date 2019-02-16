import React from "react";
import styled from "styled-components";
import Highlighter from "react-highlight-words";

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
  padding: 0.1rem 0.7rem;
  border-radius: 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
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
`;

const memoize = fn => {
  let cache = {};
  return arg => {
    if (!(arg in cache)) cache[arg] = fn(arg);
    return cache[arg];
  };
};

const githubName = memoize(link => link.replace("https://github.com/", ""));

const lower = memoize(str => str.toLowerCase());

const lowerArray = memoize(tags => tags.map(tag => tag.toLowerCase()));

const findHooks = term =>
  sortedHooks.filter(
    hook =>
      lower(hook.name).includes(lower(term)) ||
      lower(githubName(hook.repositoryUrl)).includes(lower(term)) ||
      lowerArray(hook.tags).some(tag => tag.includes(lower(term)))
  );

class IndexPage extends React.Component {
  state = { term: "", results: sortedHooks };

  render() {
    const { term, results } = this.state;

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
              results: findHooks(value)
            });
          }}
          placeholder="filter by name"
        />
        <ResultsCount>
          Found {results.length} {results.length === 1 ? "entry" : "entries"}
        </ResultsCount>
        {results.map(hook => (
          <Hook key={`${hook.repositoryUrl}-${hook.name}`}>
            <RepositoryLink href={hook.repositoryUrl}>
              <Highlighter
                searchWords={[term]}
                autoEscape={true}
                textToHighlight={githubName(hook.repositoryUrl)}
              />
            </RepositoryLink>

            <Name>
              <Highlighter
                searchWords={[term]}
                autoEscape={true}
                textToHighlight={hook.name}
              />
            </Name>
            <Pre>
              <code>{hook.importStatement}</code>
            </Pre>
            <div>
              {hook.tags.map(tag => (
                <Tag key={tag}>
                  <Highlighter
                    searchWords={[term]}
                    autoEscape={true}
                    textToHighlight={tag}
                  />
                </Tag>
              ))}
            </div>
          </Hook>
        ))}
      </Layout>
    );
  }
}

export default IndexPage;
