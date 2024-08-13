using Chunk_creator.Models;

namespace Chunk_creator;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    private readonly IServiceScopeFactory _scopeFactory;

    private IRabbitManager _manager;

    public Worker(ILogger<Worker> logger,
                    IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
        using (var scope = scopeFactory.CreateScope())
        {
            _manager = scope.ServiceProvider.GetRequiredService<IRabbitManager>();
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            if (_logger.IsEnabled(LogLevel.Information))
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            }
            await Task.Delay(1000, stoppingToken);
        }
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        _manager.Subscribe<RabbitMQUpload>(new RabbitMQUpload(
            _scopeFactory
        )
        , "Chunk-creater"
        , "direct",
        "chunker");

    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        return base.StopAsync(cancellationToken);
    }

}