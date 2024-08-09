using System.Text;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.ObjectPool;
using Newtonsoft.Json;
using RabbitMQ.Client;

public class RabbitManager : IRabbitManager
{
    private readonly DefaultObjectPool<RabbitMQ.Client.IModel> _objectPool;

    public RabbitManager(IPooledObjectPolicy<RabbitMQ.Client.IModel> objectPolicy)
    {
        _objectPool = new DefaultObjectPool<RabbitMQ.Client.IModel>
        (objectPolicy, Environment.ProcessorCount * 2);
    }

    public void Publish<T>
    (T message, string exchangeName, string exchangeType, string routeKey)
    where T : class
    {
        if (message == null) return;
        var channel = _objectPool.Get();
        try
        {
            channel.ExchangeDeclare(exchangeName, exchangeType, true, false, null);
            var sendBytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message));
            var properties = channel.CreateBasicProperties();
            properties.Persistent = true;
            channel.BasicPublish(
                exchangeName,
                routeKey,
                properties,
                sendBytes
            );
        }
        catch (Exception e)
        {
            throw e;
        }
        finally
        {
            _objectPool.Return(channel);
        }
    }
}