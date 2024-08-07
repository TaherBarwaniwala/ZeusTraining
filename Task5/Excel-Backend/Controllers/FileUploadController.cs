using Excel_Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Excel_Backend.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly UserDataContext _context;
        public FileUploadController(UserDataContext context)
        {
            _context = context;
        }
        [HttpPost()]
        public async Task<ActionResult> UploadCSVFile(IFormFile File)
        {
            Console.WriteLine(File.FileName);
            var fileStream = File.OpenReadStream();
            var reader = new StreamReader(fileStream);
            var row = await reader.ReadLineAsync();
            row = await reader.ReadLineAsync();
            var id = 1;
            while (row != null)
            {
                var columns = row.Split(",");
                _context.UserDatas.Add(new UserData
                {
                    Id = id,
                    Email = columns[0],
                    Name = columns[1],
                    Country = columns[2],
                    State = columns[3],
                    City = columns[4],
                    TelephoneNumber = columns[5],
                    AddressLine1 = columns[6],
                    AddressLine2 = columns[7],
                    DOB = columns[8],
                    FY2019_20 = UInt32.Parse(columns[9]),
                    FY2020_21 = UInt32.Parse(columns[10]),
                    FY2021_22 = UInt32.Parse(columns[11]),
                    FY2022_23 = UInt32.Parse(columns[12]),
                    FY2023_24 = UInt32.Parse(columns[13])

                });
                id += 1;
                row = await reader.ReadLineAsync();
            }
            _context.SaveChanges();
            return Ok();
        }


    }

}