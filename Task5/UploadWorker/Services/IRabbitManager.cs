using Microsoft.CodeAnalysis.CSharp.Syntax;

public interface IRabbitManager
{
    void Subscribe<T>(T subscribeObject, string exchangeName, string exchangeType, string routeKey)
    where T : IRabbitSubscribe;
}