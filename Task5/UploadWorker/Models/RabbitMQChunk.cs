using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RabbitMQ.Client.Events;
using Npgsql;
using UploadWorker.Services;

namespace UploadWorker.Models
{
    public class RabbitMQChunk : IRabbitSubscribe
    {

        private UserDataContext _context;

        private IRabbitManager _manager;

        private UploadChunkService _chunkService;

        private IServiceScopeFactory _scopeFactory;

        public RabbitMQChunk(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }
        public UploadChunk info { get; set; }

        public List<String> data { get; set; }
        public async Task Received(BasicDeliverEventArgs ea, RabbitMQ.Client.IModel channel)
        {
            var body = ea.Body.ToArray();
            using (var scope = _scopeFactory.CreateScope())
            {
                _context = scope.ServiceProvider.GetRequiredService<UserDataContext>();
                _manager = scope.ServiceProvider.GetRequiredService<IRabbitManager>();
                _chunkService = scope.ServiceProvider.GetRequiredService<UploadChunkService>();
                var rabbitMQChunk = JsonConvert.DeserializeObject<RabbitMQChunk>(Encoding.UTF8.GetString(body));
                Console.WriteLine($"Chunk {rabbitMQChunk.info.UploadChunkId} is beign proccessed ...");
                try
                {
                    await UploadRecords(rabbitMQChunk.data);
                    Console.WriteLine("Completed OPeration");
                    rabbitMQChunk.info.Status = "Completed";
                    _chunkService.UpdateAsync(rabbitMQChunk.info.UploadChunkId, rabbitMQChunk.info);
                    channel.BasicAck(ea.DeliveryTag, multiple: false);
                }
                catch (PostgresException e)
                {
                    Console.WriteLine(e);
                    if (e.SqlState == "40P01")
                    {
                        Console.WriteLine(e);
                        channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: true);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    rabbitMQChunk.info.Status = "Failed";
                    _chunkService.UpdateAsync(rabbitMQChunk.info.UploadChunkId, rabbitMQChunk.info);
                    channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: false);
                }

            }

        }

        private async Task UploadRecords(List<String> rows)
        {
            StringBuilder query = new();
            query.Append("insert into public.\"UserDatas\" ( \"Email\" , \"Name\",\"Country\",\"State\",\"City\",\"TelephoneNumber\",\"AddressLine1\",\"AddressLine2\",\"DOB\",\"FY2019_20\",\"FY2020_21\",\"FY2021_22\",\"FY2022_23\",\"FY2023_24\") values");
            for (var i = 0; i < rows.Count; i++)
            {
                string row = rows[i];
                row = Regex.Replace(row, @"'", "\'\'");
                var c = row.Split(",");
                query.AppendFormat($"( \'{c[0]}\' , \'{c[1]}\', \'{c[2]}\', \'{c[3]}\', \'{c[4]}\', \'{c[5]}\', \'{c[6]}\', \'{c[7]}\', \'{c[8]}\', {c[9]},  {c[10]},{c[11]} ,{c[12]} , {c[13]} )");
                if (i < rows.Count - 1) query.Append(',');
            }
            query.Append(" on conflict do nothing");
            await _context.Database.ExecuteSqlRawAsync(query.ToString());
        }
    }
}