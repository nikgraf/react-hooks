import React, { useState } from "react";
import styled from "styled-components";
import Highlighter from "react-highlight-words";

import unsortedHooks from "../../../hooks.json";
import Layout from "../components/layout";
import { findHooks, githubName, sortHooks } from "../utils";

const device = {
    desktop: '(min-width: 768px)',
};

const Hook = styled.div`
  margin-bottom: 4rem;
`;

const RepositoryLink = styled.a`
  display: block;
  font-size: .85em;
  
  @media ${device.desktop} {
    display: initial;
    font-size: inherit;
    float: right;
  }
`;

const Name = styled.h2`
  font-family: "Space Mono", monospace;
  margin-bottom: .2rem;
  
  @media ${device.desktop} {
    display: inline-block;
  }
`;

const Pre = styled.pre`
  display: block;
  margin: 5% 0;
  padding: .6rem;
  
  @media ${device.desktop} {
    margin: 3% 0;
  }
`;

const Tag = styled.a`
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

const IndexPage = () => {
  const [term, setTerm] = useState("");
  const search = term.trim();
  const allHooks = sortHooks(unsortedHooks);
  const results = findHooks(search, allHooks);
  const tagsToSearch =
    search === "#" ? ["#"] : [search, search.replace("#", "")];

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
          setTerm(value);
        }}
        placeholder="filter by name"
      />
      <ResultsCount>
        Found {results.length} {results.length === 1 ? "entry" : "entries"}
      </ResultsCount>
      {results.map(hook => (
        <Hook key={`${hook.repositoryUrl}-${hook.name}`}>
          <Name>
            <Highlighter
              searchWords={[search]}
              autoEscape={true}
              textToHighlight={hook.name}
            />
          </Name>
          <RepositoryLink href={hook.repositoryUrl}>
            <Highlighter
                searchWords={[githubName(search)]}
                autoEscape={true}
                textToHighlight={githubName(hook.repositoryUrl)}
            />
          </RepositoryLink>
          <Pre>
            <code>{hook.importStatement}</code>
          </Pre>
          <div>
            {hook.tags.map(tag => (
              <Tag
                key={tag}
                href={`#${tag}`}
                onClick={event => {
                  event.preventDefault();
                  setTerm(`#${tag}`);
                }}
              >
                <Highlighter
                  searchWords={tagsToSearch}
                  autoEscape={true}
                  textToHighlight={`#${tag}`}
                />
              </Tag>
            ))}
          </div>
        </Hook>
      ))}
    </Layout>
  );
};

export default IndexPage;
