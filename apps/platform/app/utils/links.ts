const getRoutes = () => {
  return {
    Home: '/',
    Connections: '/connections',
    Projects: '/projects',
    Shared: '/shared',
    Profile: '/profile',
    Events: '/events',
  }
}

const getRouterLinks = () => {
  const { Connections, Projects, Events, Shared } = getRoutes()
  return [
    {
      name: 'Connections',
      id: 'connections',
      path: Connections,
    },
    {
      name: 'Projects',
      id: 'projects',
      path: Projects,
    },
    {
      name: 'Events',
      id: 'events',
      path: Events,
    },
    {
      name: 'Shared',
      id: 'shared',
      path: Shared,
    },
  ]
}

const joinWithSlash = (...args: (string | number)[]) => {
  return args.join('/')
}

export { getRoutes, getRouterLinks, joinWithSlash }
