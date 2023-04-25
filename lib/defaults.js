const { MANAGERS } = require("./constants");

module.exports = {
  Express: {
    defaultName: 'express_server',
    subrepo: 'express',
    managers: [MANAGERS.NPM, MANAGERS.YARN],
  },
  'Socket.io': {
    defaultName: 'socketio_server',
    subrepo: 'socketio',
    managers: [MANAGERS.NPM, MANAGERS.YARN],
  },
  Elixir: {
    defaultName: 'elixir_server',
    subrepo: 'elixir_server',
    managers: [MANAGERS.MIX],
  },
  'ReactJS + MUI': {
    defaultName: 'react_client',
    subrepo: 'react',
    managers: [MANAGERS.NPM, MANAGERS.YARN],
  },
  'Rust + Axum': {
    defaultName: 'rust_server',
    subrepo: 'rust',
    managers: [MANAGERS.CARGO],
  },
};
