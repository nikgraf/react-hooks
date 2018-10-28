import React from "react";
import styled from "styled-components";
// import { Link } from 'gatsby'

import Layout from "../components/layout";
import hooks from "../../../hooks.json";

const Hook = styled.div`
  margin-bottom: 4rem;
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

const IndexPage = () => (
  <Layout>
    {hooks.map(hook => (
      <Hook>
        <RepositoryLink href={hook.repositoryUrl}>
          {hook.repositoryUrl}
        </RepositoryLink>

        <h2>{hook.name}</h2>
        <Pre>
          <code>{hook.importStatement}</code>
        </Pre>
        <div>
          {hook.tags.map(tag => (
            <Tag>{tag}</Tag>
          ))}
        </div>
      </Hook>
    ))}
    {/* <Link to="/page-2/">Go to page 2</Link> */}
  </Layout>
);

export default IndexPage;
