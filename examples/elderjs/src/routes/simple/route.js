module.exports = {
  // the all function returns an array of all of the 'request' objects of a route.
  // In this route, we're only returning one.
  // if all() is ommited, an array of [{slug: 'route-name'}] will be set.
  all: async () => [{ slug: 'simple' }],
  // the permalink function takes a 'request' object and returns a relative permalink.
  // In this case "/simple/"
  permalink: '/:slug/',
  data: async ({ request }) => {
    // The data function populates an object that will be in available in our Svelte template under the 'data' key.
    return {
      title: 'Elder.js Route: An Overview',
      steps: [
        `Step 1: All routes require a route.js and a svelte template. Look at ./src/routes/simple/route.js to follow along.`,
        `Step 2: We define an 'all()' function that returns an array of 'request' objects.`,
        `Step 3: We define a permalink function that transforms the 'request' objects from 'all()' into permalinks.`,
        `Step 4: We define a data function that makes data available in your svelte template.`,
      ],
      content: `
      <h2>How Routing Works:</h2>
      <p>Elder.js's routing flow is different from what you'll see in other frameworks such as <span class="code">express</span>.</p>
      <p>Most frameworks define routes like so: <span class="code">/blog/:slug/</span>.</p>
      <p>Then when you visit <span class="code">/blog/simple/</span> that route would receive a <span class="code">request</span> object of 
      <span class="code">{ slug: "simple" }</span>.

      <p>While this approach works, a huge downside is that it forces a static site generator to crawl all of the links on a site to know all of the request objects.</p>
      <p>Since Elder.js is built for speed and crawling is expensive, Elder.js asks you to define all of your <span class="code">request</span> objects in your <span class="code">all()</span> function.</p>
      <p>Once it has your requests, it runs them through the <span class="code">permalink()</span> function to can build an entire map of your site so we don't have to crawl it but can generate it on the fly.</p>
      <h3>Learning Exercise: </h3>
      <p>Try adding <span class="code">{ slug: "another-request" }</span> to the <span class="code">all()</span> function in <span class="code">./src/simple/route.js</span> 
      and then visit /another-request/ to see that you added another page with the same data.</p>
      `,
    };
  },

  // template: 'Simple.svelte' // this is auto-detected.
  // layout: 'Layout.svelte' // this is auto-detected.
};
