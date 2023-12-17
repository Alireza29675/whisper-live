// Gets the pages from the given directory
const pages = import.meta.glob('../pages/**/index.tsx')

// Returns an array of page modules
export const getPages = async (): Promise<IPageModule[]> => {
  const uris = Object.keys(pages);
  // Returns the page modules from the given paths
  const pageModules = await Promise.all(
    uris.map(async (path) => {
      const page = await pages[path]() as {
        default: IPageModule['component'];
        metadata: IPageModule['metadata'];
      }

      return {
        path: path.replace('../pages', '').replace('/index.tsx', ''),
        component: page.default,
        metadata: page.metadata,
      }
    })
  )

  return pageModules.filter((page) => page.metadata && page.metadata.route)
}