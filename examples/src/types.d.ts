interface IPageModule {
  path: string
  component: React.FC
  metadata: {
    title: string
    route: string
  }
}