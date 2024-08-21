
using System.Text;
using System.Text.RegularExpressions;
using Excel_Backend.Models;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using Excel_Backend.Services;
using Microsoft.OpenApi.Any;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Components.Web;
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

        private readonly FileUploadInMemoryContext _fileInMemoryContext;

        private static List<string> _fileActiveQueue = new();

        private List<String> rows;

        private StringBuilder FileName;

        public FileUploadController(
        UserDataContext context,
        FileUploadInMemoryContext fileUploadInMemoryContext,
        UploadChunkService chunkService,
        FileUploadService fileService,
        IRabbitManager manager)
        {
            _context = context;
            _fileInMemoryContext = fileUploadInMemoryContext;
            _chunkService = chunkService;
            _fileService = fileService;
            _manager = manager;
        }
        [HttpPost()]
        public async Task<ActionResult<FileUpload>> UploadCSVFile()
        {
            var files = Request.Form.Files;
            Console.WriteLine(files.Count);
            if (files.Count == 0) return NotFound();
            FileUpload file = new();
            file.FileId = Guid.NewGuid().ToString();
            file.ChunkIds = new();
            FileName = new();
            _fileActiveQueue.Add(file.FileId);
            foreach (var File in files)
            {
                FileName.Append(File.FileName);
            }
            file.FileName = FileName.ToString();
            await _fileService.CreateASync(file);
            foreach (var File in files)
            {
                Console.WriteLine(File.FileName);
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
            };
            return Ok(file);
        }

        [HttpGet("status")]
        public async Task<ActionResult> GetCurrentStatus()
        {
            return Ok(new
            {
                ActiveFileIds = _fileActiveQueue
            });
        }

        [HttpPost("update/{FileId}")]
        public async Task<ActionResult> UpdateFileStatus(string FileId)
        {
            var file = await _fileService.GetAsync(FileId);
            if (file == null)
            {
                return NotFound();
            }
            if (file.ChunkIds?.Count == 0)
            {
                return Ok();
            }
            int progress = 0;
            for (var i = 0; i < file.ChunkIds?.Count; i++)
            {
                var chunk = await _chunkService.GetAsync(file.ChunkIds[i]);
                if (chunk?.Status == "Failed")
                {
                    _fileActiveQueue.Remove(FileId);
                }
                if (chunk?.Status == "Completed") progress++;
            }
            if (progress == file.ChunkIds?.Count)
            {
                _fileActiveQueue.Remove(FileId);
            }
            return Ok();
        }

        [HttpGet("{FileId}")]
        public async Task<ActionResult> GetFileStatus(string FileId)
        {
            var file = await _fileService.GetAsync(FileId);
            if (file == null)
            {
                return NotFound(new
                {
                    message = "Invalid File Id",
                    status = "Failed"
                });
            }
            if (file.ChunkIds?.Count == 0)
            {
                return Ok(new
                {
                    status = "Ready",
                    progress = 0,
                    fileName = file.FileName
                });
            }
            int progress = 0;
            for (var i = 0; i < file.ChunkIds?.Count; i++)
            {
                var chunk = await _chunkService.GetAsync(file.ChunkIds[i]);
                if (chunk?.Status == "Failed")
                {
                    return Ok(new
                    {
                        status = "Failed",
                        fileName = file.FileName
                    });
                }
                if (chunk?.Status == "Completed") progress++;
            }
            if (progress == file.ChunkIds?.Count)
            {
                return Ok(new
                {
                    fileName = file.FileName,
                    status = "Completed",
                });
            }
            return Ok(new
            {
                fileName = file.FileName,
                status = "Running",
                progress = progress * 100 / file.ChunkIds?.Count
            });

        }

    }

}