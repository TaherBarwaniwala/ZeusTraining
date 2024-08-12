using Microsoft.EntityFrameworkCore.Metadata.Internal;
using RabbitMQ.Client.Events;

public interface IRabbitSubscribe
{
    async Task Received(BasicDeliverEventArgs ea, RabbitMQ.Client.IModel channel) { }
}