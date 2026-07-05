defmodule ElixirServer.Application do
  use Application
  require Logger

  @impl true
  def start(_type, _args) do
    children = [
      {
        Plug.Cowboy,
        # adding ip option does not seem to work
        scheme: :http, plug: ElixirServer.Router, options: [port: get_port()]
      }
    ]

    opts = [strategy: :one_for_one, name: ElixirServer.Supervisor]

    Logger.info(
      "Starting server on #{Application.get_env(:elixir_server, :host, "localhost")}:8081"
    )

    Supervisor.start_link(children, opts)
  end

  defp get_port, do: Application.get_env(:elixir_server, :port, 8080)

  @spec get_hostname :: tuple
  def get_hostname do
    hostname = Application.get_env(:elixir_server, :host, "localhost")

    hostname =
      if hostname !== "localhost" do
        List.to_tuple(String.split(hostname, ".") |> Enum.map(&String.to_integer/1))
      else
        {127, 0, 0, 0}
      end

    hostname
  end
end
