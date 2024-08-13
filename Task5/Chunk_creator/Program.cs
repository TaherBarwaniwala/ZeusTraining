using Chunk_creator;
using Chunk_creator.Models;
using Chunk_creator.Services;
using Microsoft.Extensions.ObjectPool;
using RabbitMQ.Client;
var builder = Host.CreateApplicationBuilder(args);
builder.Services.Configure<RabbitMQSettings>(
    builder.Configuration.GetSection("RabbitMQ")
);
builder.Services.Configure<UploadChunkDBSettings>(
    builder.Configuration.GetSection("ChunkStoreDatabase")
);
builder.Services.Configure<FileUploadDBSettings>(
    builder.Configuration.GetSection("FileStoreDatabase")
);
// builder.Logging.AddOpenTelemetry(logging => logging.AddOtlpExporter())
builder.Services.AddSingleton<UploadChunkService>();
builder.Services.AddSingleton<FileUploadService>();
builder.Services.AddSingleton<ObjectPoolProvider, DefaultObjectPoolProvider>();
builder.Services.AddSingleton<IPooledObjectPolicy<IModel>, RabbitMQService>();
builder.Services.AddSingleton<IRabbitManager, RabbitManager>();
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
