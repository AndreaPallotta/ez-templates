defmodule ElixirServer.Router do
  use Plug.Router

  alias ElixirServer.Plug.VerifyRequest

  plug(Plug.Parsers, parsers: [:urlencoded, :multipart])
  plug(VerifyRequest, fields: ["content", "mimetype"], paths: ["/random"])
  plug(:match)
  plug(:dispatch)

  get "/" do
    send_resp(conn, 200, "Welcome")
  end

  get "/random" do
    send_resp(conn, 201, "Random")
  end

  match _ do
    send_resp(conn, 404, "Not Found")
  end
end
