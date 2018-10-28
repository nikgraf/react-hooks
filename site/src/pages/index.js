import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import hooks from '../../../hooks.json'

const IndexPage = () => (
  <Layout>
    {hooks.map((hook) => <div>
      <h2>{hook.name}</h2>
      {hook.repositoryUrl}
      <pre><code>{hook.importStatement}</code></pre>
      <div>
        {hook.tags.map((tag) => <span>{tag}</span>)}
      </div>
    </div>)}
    {/* <Link to="/page-2/">Go to page 2</Link> */}
  </Layout>
)

export default IndexPage
