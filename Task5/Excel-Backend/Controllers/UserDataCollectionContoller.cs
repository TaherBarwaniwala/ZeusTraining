using Excel_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;

namespace Excel_Backend.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UserDataCollectionController : ControllerBase
    {
        UserDataContext _context;
        public UserDataCollectionController(UserDataContext context)
        {
            _context = context;
        }

        [HttpGet("{Email}")]
        public async Task<ActionResult<IEnumerable<UserData>>> GetUserDataCollection(long rownum)
        {
            var res = _context.UserDatas.FromSql<UserData>($"Select * from public.\"UserDatas\" LIMIT 1000");
            return await res.ToListAsync<UserData>();
        }

    }
}