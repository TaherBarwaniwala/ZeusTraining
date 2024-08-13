using Chunk_creator.Models;
using Microsoft.Extensions.ObjectPool;
using Microsoft.Extensions.Options;
using MongoDB.Driver.Core.Connections;
using RabbitMQ.Client;

namespace Chunk_creator.Services
{
    public class RabbitMQService : IPooledObjectPolicy<IModel>
    {
        private readonly RabbitMQSettings _options;

        private readonly RabbitMQ.Client.IConnection _connection;
        public RabbitMQService(IOptions<RabbitMQSettings> options)
        {
            _options = options.Value;
            _connection = GetConnection();
        }

        private RabbitMQ.Client.IConnection GetConnection()
        {
            var factory = new ConnectionFactory()
            {
                HostName = _options.HostName,
                UserName = _options.UserName,
                Password = _options.Password,
                Port = _options.Port
            };

            return factory.CreateConnection();

        }

        public RabbitMQ.Client.IModel Create()
        {
            return _connection.CreateModel();
        }

        public bool Return(IModel obj)
        {
            if (obj.IsOpen)
            {
                return true;
            }
            else
            {
                obj?.Dispose();
                return false;
            }
        }

    }
}