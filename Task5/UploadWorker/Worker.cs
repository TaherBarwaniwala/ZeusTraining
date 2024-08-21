using UploadWorker.Models;
using UploadWorker.Services;

namespace UploadWorker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    private readonly UserDataContext _context;

    private readonly UploadChunkService _chunkService;

    private readonly IServiceScopeFactory _scopeFactory;

    private IRabbitManager _manager;

    private IConfiguration _config;

    public Worker(ILogger<Worker> logger,
                    IServiceScopeFactory scopeFactory,
                    IConfiguration configuration)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
        _config = configuration;
        using (var scope = scopeFactory.CreateScope())
        {
            _context = scope.ServiceProvider.GetRequiredService<UserDataContext>();
            _manager = scope.ServiceProvider.GetRequiredService<IRabbitManager>();
            _chunkService = scope.ServiceProvider.GetRequiredService<UploadChunkService>();
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
        _manager.Subscribe<RabbitMQChunk>(new RabbitMQChunk(
            _scopeFactory,
            _config
        )
        , "upload_event"
        , "direct",
        "upload-key");

    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        return base.StopAsync(cancellationToken);
    }

}
