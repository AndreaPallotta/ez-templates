defmodule ElixirServer.Plug.VerifyRequest do
  defmodule InvalidRequestError do
    @moduledoc """
    Error thrown when the request does not contain
    the expected parameters.
    """

    defexception message: ""
  end

  def init(options), do: options

  def call(%Plug.Conn{request_path: path} = conn, opts) do
    if path in opts[:paths], do: validate_params!(conn.params, opts[:fields])
    conn
  end

  def validate_params!(params, fields) do
    is_valid = params |> Map.keys() |> contains_fields?(fields)

    unless is_valid, do: raise(InvalidRequestError)
  end

  defp contains_fields?(keys, fields), do: Enum.all?(fields, &(&1 in keys))
end
