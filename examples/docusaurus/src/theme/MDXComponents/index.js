import InitialComponents from '@theme-init/MDXComponents';


const newExport = {}
Object.entries(InitialComponents).forEach(key => {
  if (key !== "pre" && key !== "code") newExport[key] = InitialComponents[key]
})

export default newExport
