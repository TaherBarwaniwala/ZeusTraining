using UploadWorker;
using UploadWorker.Models;
using UploadWorker.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.ObjectPool;
using RabbitMQ.Client;
// using OpenTelemetry.Logs;
var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddDbContext<UserDataContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<RabbitMQSettings>(
    builder.Configuration.GetSection("RabbitMQ")
);
builder.Services.Configure<UploadChunkDBSettings>(
    builder.Configuration.GetSection("ChunkStoreDatabase")
);

// builder.Logging.AddOpenTelemetry(logging => logging.AddOtlpExporter())
builder.Services.AddSingleton<UploadChunkService>();
builder.Services.AddSingleton<ObjectPoolProvider, DefaultObjectPoolProvider>();
builder.Services.AddSingleton<IPooledObjectPolicy<IModel>, RabbitMQService>();
builder.Services.AddSingleton<IRabbitManager, RabbitManager>();
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
