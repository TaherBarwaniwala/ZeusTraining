using System.Text;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using RabbitMQ.Client.Events;
using Chunk_creator.Services;
namespace Chunk_creator.Models
{
    public class RabbitMQUpload : IRabbitSubscribe
    {

        private IServiceScopeFactory _scopeFactory;

        private IRabbitManager _manager;

        private UploadChunkService _chunkService;

        private FileUploadService _fileSevice;

        public RabbitMQUpload(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public byte[] File { get; set; }

        public FileUpload FileInfo { get; set; }


        public async Task Received(BasicDeliverEventArgs ea, RabbitMQ.Client.IModel channel)
        {
            var body = ea.Body.ToArray();
            var rabbitMQUpload = JsonConvert.DeserializeObject<RabbitMQUpload>(Encoding.UTF8.GetString(body));
            Console.WriteLine(rabbitMQUpload.FileInfo.FileId);
            try
            {
                var reader = new StreamReader(new MemoryStream(rabbitMQUpload.File), Encoding.Default);
                // _ftpClient.UploadStream(fileStream, $"/Uploads/{file.FileId}", createRemoteDir: true);
                var row = await reader.ReadLineAsync();
                row = await reader.ReadLineAsync();
                int count;
                List<String> rows;
                using (var scope = _scopeFactory.CreateScope())
                {
                    _manager = scope.ServiceProvider.GetRequiredService<IRabbitManager>();
                    _chunkService = scope.ServiceProvider.GetRequiredService<UploadChunkService>();
                    _fileSevice = scope.ServiceProvider.GetRequiredService<FileUploadService>();
                    while (row != null)
                    {
                        UploadChunk chunk = new();
                        chunk.UploadChunkId = Guid.NewGuid().ToString();
                        chunk.Status = "Ready";
                        rows = new();
                        count = 1;
                        while (count <= 5000 && row != null)
                        {
                            rows.Add(row);
                            count += 1;
                            row = await reader.ReadLineAsync();
                        }
                        rabbitMQUpload.FileInfo.ChunkIds.Add(chunk.UploadChunkId);
                        await _chunkService.CreateASync(chunk);
                        _manager.Publish(
                            new
                            {
                                info = chunk,
                                data = rows
                            },
                            "upload_event",
                            "direct",
                            "upload-key"
                        );

                    }
                    await _fileSevice.UpdateAsync(rabbitMQUpload.FileInfo.FileId, rabbitMQUpload.FileInfo);
                    channel.BasicAck(ea.DeliveryTag, multiple: false);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: true);

            }
        }

    }
}