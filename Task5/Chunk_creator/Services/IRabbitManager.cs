

public interface IRabbitManager
{
    void Subscribe<T>(T subscribeObject, string exchangeName, string exchangeType, string routeKey)
    where T : IRabbitSubscribe;
    void Publish<T>(T message, string exchangeName, string exchangeType, string routeKey)
    where T : class;
}