import Config

config :elixir_server,
  host: "localhost", # Either "localhost" or "<ip>"
  port: 8081

import_config("#{config_env()}.exs")
