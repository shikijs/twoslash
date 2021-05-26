<script>
  export let blog;
  export let helpers;
</script>

<div class="entry">
  <a href={helpers.permalinks.blog({ slug: blog.slug })}>{blog.frontmatter.title}</a>
  <p>{blog.frontmatter.excerpt}</p>
</div>
