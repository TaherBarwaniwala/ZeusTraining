namespace Chunk_creator.Models;

public class RabbitMQSettings
{
    public string HostName { get; set; } = null!;

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int Port { get; set; }

}