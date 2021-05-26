<script>
  export let request;
</script>

<svelte:head>
  <title>Test Title: {request.foo} {request.bar}</title>
  <meta name="description" content="Test Description: {request.foo} {request.bar}" />
  <link href={request.permalink} rel="canonical" />
</svelte:head>

These params are generated from the url. They are only available in SSR mode unless the `all()` function returns
requests.

<ul>
  <li>foo: {request.foo}</li>
  <li>bar: {request.bar}</li>
</ul>
