<script>
  import HookDetail from '../../components/HookDetail.svelte';

  export let data;
  export let request;
</script>

<style>
  a {
    margin-bottom: 1rem;
    display: inline-block;
  }
</style>

<svelte:head>
  <title>{data.hook.hook} Hook Interface: Elder.js Example Project</title>
  <meta name="description" content="Hook details for {data.hook.hook} in Elder.js from the Hook Interface" />
  <link href={request.permalink} rel="canonical" />
</svelte:head>

<a href="/">&LeftArrow; Home</a>

<h1>{data.hook.hook}</h1>

<HookDetail {...data} />

<img
  src="https://elderguide.com/images/elderjs-hooks-v100.png"
  alt="Elder.js hook Lifecycle"
  style="max-width:100%; margin:1rem 0;" />
