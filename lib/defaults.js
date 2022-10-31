module.exports = {
  Express: {
    defaultName: 'express_server',
    subrepo: 'express',
    managers: ['npm', 'yarn'],
  },
  'Socket.io': {
    defaultName: 'socketio_server',
    subrepo: 'socketio',
    managers: ['npm', 'yarn'],
  },
  Elixir: {
    defaultName: 'elixir_server',
    subrepo: 'elixir_server',
    managers: ['mix'],
  },
  'ReactJS + MUI': {
    defaultName: 'react_client',
    subrepo: 'react',
    managers: ['npm', 'yarn'],
  },
};
