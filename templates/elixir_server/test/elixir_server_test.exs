defmodule ElixirServerTest do
  use ExUnit.Case
  doctest ElixirServer

  test "greets the world" do
    assert ElixirServer.hello() == :world
  end
end
