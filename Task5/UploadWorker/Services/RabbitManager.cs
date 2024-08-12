using System.Text;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.ObjectPool;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

public class RabbitManager : IRabbitManager
{
    private readonly DefaultObjectPool<RabbitMQ.Client.IModel> _objectPool;

    public RabbitManager(IPooledObjectPolicy<RabbitMQ.Client.IModel> objectPolicy)
    {
        _objectPool = new DefaultObjectPool<RabbitMQ.Client.IModel>
        (objectPolicy, Environment.ProcessorCount * 2);
    }

    public void Subscribe<T>
    (T SubscribeObject, string exchangeName, string exchangeType, string routeKey)
    where T : IRabbitSubscribe
    {
        var channel = _objectPool.Get();
        try
        {
            channel.ExchangeDeclare(exchangeName, exchangeType, true, false, null);
            var sendBytes = Encoding.UTF8.GetBytes("");
            var properties = channel.CreateBasicProperties();
            properties.Persistent = true;
            var queueName = "upload_queue";
            channel.QueueDeclare(queue: queueName,
                      durable: true,
                      exclusive: false,
                      autoDelete: false,
                      arguments: null);

            channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: true);
            channel.QueueBind(queue: queueName,
                exchange: exchangeName,
                routingKey: routeKey);
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                await SubscribeObject.Received(ea, channel);
            };
            channel.BasicConsume(queue: queueName,
                                autoAck: false,
                                consumer: consumer);

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