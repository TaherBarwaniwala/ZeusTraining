using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Excel_Backend.Models;
using Microsoft.AspNetCore.JsonPatch;
using MongoDB.Bson;
using System.Text.Json;

namespace Excel_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDatasController : ControllerBase
    {
        private readonly UserDataContext _context;

        public UserDatasController(UserDataContext context)
        {
            _context = context;
        }

        // GET: api/UserDatas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserData>>> GetUserDatas()
        {
            return await _context.UserDatas.ToListAsync();
        }

        // GET: api/UserDatas/5
        [HttpGet("{Email}")]
        public async Task<ActionResult<UserData>> GetUserData(string Email)
        {
            var userData = await _context.UserDatas.FindAsync(Email);

            if (userData == null)
            {
                return NotFound();
            }
            return userData;
        }

        // [HttpGet("columnName")]
        // public async Task<ActionResult<IQueryable<UserData>>> GetColumnNames()
        // {
        //     var columnNames = _context.UserDatas.FromSql($"Select * from INFORMATION_SCHEMA.TABLE_NAME where TABLE=N'UserDatas'");
        //     if (columnNames == null)
        //     {
        //         return NotFound();
        //     }
        //     return new ActionResult<IQueryable<UserData>>(columnNames);
        // }

        // PUT: api/UserDatas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{Email}")]
        public async Task<IActionResult> PutUserData(string Email, UserData userData)
        {
            if (Email != userData.Email)
            {
                return BadRequest();
            }

            _context.Entry(userData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserDataExists(Email))
                {
                    await _context.UserDatas.AddAsync(userData);
                    await _context.SaveChangesAsync();
                    return NoContent();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPut("BulkUpdate")]
        public async Task<IActionResult> PutUserDataBulk()
        {

            var userDatas = await JsonSerializer.DeserializeAsync<UserData[]>(Request.Body);
            // if (Email != userData.Email)
            // {
            //     return BadRequest();
            // }

            _context.UserDatas.UpdateRange(userDatas);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // if (!UserDataExists(Email))
                // {
                //     await _context.UserDatas.AddAsync(userData);
                //     await _context.SaveChangesAsync();
                //     return NoContent();
                // }
                // else
                // {
                //     throw;
                // }
            }

            return NoContent();
        }


        // POST: api/UserDatas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserData>> PostUserData(UserData userData)
        {
            _context.UserDatas.Add(userData);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserData", new { email = userData.Email }, userData);
        }



        // DELETE: api/UserDatas/5
        [HttpDelete("{Email}")]
        public async Task<IActionResult> DeleteUserData(string Email)
        {
            var userData = await _context.UserDatas.FindAsync(Email);
            if (userData == null)
            {
                return NotFound();
            }

            _context.UserDatas.Remove(userData);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserDataExists(string Email)
        {
            return _context.UserDatas.Any(e => e.Email == Email);
        }

        // [HttpPatch]
        // public async Task<IActionResult> PatchUserData([FromBody] JsonPatchDocument<UserData> patchdoc)
        // {
        //     if (patchdoc != null)
        //     {
        //         var user = new UserData();
        //         patchdoc.ApplyTo(user, ModelState);
        //         if (!ModelState.IsValid)
        //         {
        //             return BadRequest();
        //         }
        //         else
        //         {
        //             return new ObjectResult(user);
        //         }
        //     }
        //     else
        //     {
        //         return BadRequest();
        //     }
        // }
    }
}
