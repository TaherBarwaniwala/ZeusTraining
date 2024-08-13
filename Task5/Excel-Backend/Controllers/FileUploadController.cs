
using System.Text;
using System.Text.RegularExpressions;
using Excel_Backend.Models;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using Excel_Backend.Services;
// using FluentFTP;

namespace Excel_Backend.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly UserDataContext _context;

        private readonly UploadChunkService _chunkService;

        private readonly FileUploadService _fileService;

        private IRabbitManager _manager;

        // private readonly FtpClient _ftpClient;

        private List<String> rows;

        public FileUploadController(UserDataContext context,
        UploadChunkService chunkService,
        FileUploadService fileService,
        IRabbitManager manager)
        {
            _context = context;
            _chunkService = chunkService;
            _fileService = fileService;
            _manager = manager;
            // _ftpClient = new FtpClient("127.0.0.1");
            // _ftpClient.Credentials = new System.Net.NetworkCredential("user", "zeus");
            // _ftpClient.Connect();
        }
        [HttpPost()]
        public async Task<ActionResult<FileUpload>> UploadCSVFile(IFormFile File)
        {
            FileUpload file = new();
            file.FileId = Guid.NewGuid().ToString();
            file.ChunkIds = new();
            MemoryStream stream = new();
            File.CopyTo(stream);
            byte[] filebytes = stream.ToArray();
            _manager.Publish(new
            {
                File = filebytes,
                FileInfo = file
            },
            "Chunk-creater",
            "direct",
            "chunker");
            // var fileStream = File.OpenReadStream();
            // var reader = new StreamReader(fileStream);
            // _ftpClient.UploadStream(fileStream, $"/Uploads/{file.FileId}", createRemoteDir: true);
            // var row = await reader.ReadLineAsync();
            // row = await reader.ReadLineAsync();
            // int count;
            // List<String> rows;
            // while (row != null)
            // {
            //     UploadChunk chunk = new();
            //     chunk.UploadChunkId = Guid.NewGuid().ToString();
            //     chunk.Status = "Ready";
            //     rows = new();
            //     count = 1;
            //     while (count <= 5000 && row != null)
            //     {
            //         rows.Add(row);
            //         count += 1;
            //         row = await reader.ReadLineAsync();
            //     }
            //     file.ChunkIds.Add(chunk.UploadChunkId);
            //     await _chunkService.CreateASync(chunk);
            //     _manager.Publish(
            //         new
            //         {
            //             info = chunk,
            //             data = rows
            //         },
            //         "upload_event",
            //         "direct",
            //         "upload-key"
            //     );

            // }
            await _fileService.CreateASync(file);
            return Ok(file);
        }

        private async Task UploadRecords(List<StringBuilder> rows)
        {
            StringBuilder query = new();
            query.Append("insert into public.\"UserDatas\" ( \"Email\" , \"Name\",\"Country\",\"State\",\"City\",\"TelephoneNumber\",\"AddressLine1\",\"AddressLine2\",\"DOB\",\"FY2019_20\",\"FY2020_21\",\"FY2021_22\",\"FY2022_23\",\"FY2023_24\") values");
            for (var i = 0; i < rows.Count; i++)
            {
                string row = rows[i].ToString();
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