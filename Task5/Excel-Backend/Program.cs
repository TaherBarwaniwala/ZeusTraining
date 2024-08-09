using Excel_Backend.Models;
using Excel_Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.ObjectPool;
using RabbitMQ.Client;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<FileUploadDBSettings>(
    builder.Configuration.GetSection("FileStoreDatabase")
);
builder.Services.AddSingleton<FileUploadService>();
builder.Services.Configure<UploadChunkDBSettings>(
    builder.Configuration.GetSection("ChunkStoreDatabase")
);
builder.Services.AddSingleton<UploadChunkService>();
builder.Services.Configure<RabbitMQSettings>(
    builder.Configuration.GetSection("RabbitMQ")
);
builder.Services.AddSingleton<ObjectPoolProvider, DefaultObjectPoolProvider>();
builder.Services.AddSingleton<IPooledObjectPolicy<IModel>, RabbitMQService>();
builder.Services.AddSingleton<IRabbitManager, RabbitManager>();
builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<UserDataContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.DisplayRequestDuration();
    });
}

app.UseHttpsRedirection();

app.UseCors(builder => builder
       .AllowAnyHeader()
       .AllowAnyMethod()
       .AllowAnyOrigin()
    );

app.UseAuthorization();

app.MapControllers();

app.Run();
