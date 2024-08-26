using System.Runtime.CompilerServices;
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

        [HttpGet("{rownum}")]
        public async Task<ActionResult<IEnumerable<UserData>>> GetUserDataCollection(long rownum)
        {
            rownum = (rownum / 1000) * 1000;
            var res = _context.UserDatas.FromSql<UserData>($"Select * from public.\"UserDatas\" order by \"Email\" LIMIT 1000 OFFSET {rownum}");
            return await res.ToListAsync<UserData>();
        }

        [HttpGet("FindAll/{Element}/{sort}")]
        public async Task<ActionResult> FindUserElement(string Element, string sort = "Email")
        {
            string query = $"with newtable as"
                    + $"("
                    + $"select public.\"UserDatas\".* , row_number() Over() as rownum "
                    + $"from public.\"UserDatas\" "
                    + $"order by \"{sort}\" "
                    + $")";


            Element = Element.ToLower();
            if (int.TryParse(Element, out _))
            {
                query += $"Select * from newtable where (LOWER(\"Email\") like \'%{Element}%\')"
             + $" or (LOWER(\"Name\") like \'%{Element}%\')"
             + $" or (LOWER(\"Country\") like \'%{Element}%\') "
             + $" or (LOWER(\"State\") like \'%{Element}%\' )"
             + $" or (LOWER(\"City\") like \'%{Element}%\' )"
             + $" or (LOWER(\"TelephoneNumber\") like \'%{Element}%\' )"
             + $" or (LOWER(\"AddressLine1\") like \'%{Element}%\') "
             + $" or (LOWER(\"AddressLine2\") like \'%{Element}%\') "
             + $" or (LOWER(\"DOB\") like \'%{Element}%\') "
             + $" or (\"FY2019_20\" = {Element} )"
             + $" or (\"FY2020_21\" = {Element} )"
             + $" or (\"FY2021_22\" = {Element} )"
             + $" or (\"FY2022_23\" = {Element} )"
             + $" or (\"FY2023_24\" = {Element}) ";
                // + $" order by \"{sort}\"";
                // Console.WriteLine(query);
            }
            else
            {
                query += $"Select * from newtable where (LOWER(\"Email\") like \'%{Element}%\')"
                 + $" or (LOWER(\"Name\") like \'%{Element}%\')"
                 + $" or (LOWER(\"Country\") like \'%{Element}%\') "
                 + $" or (LOWER(\"State\") like \'%{Element}%\' )"
                 + $" or (LOWER(\"City\") like \'%{Element}%\' )"
                 + $" or (LOWER(\"TelephoneNumber\") like \'%{Element}%\' )"
                 + $" or (LOWER(\"AddressLine1\") like \'%{Element}%\') "
                 + $" or (LOWER(\"AddressLine2\") like \'%{Element}%\') "
                 + $" or (LOWER(\"DOB\") like \'%{Element}%\') "
                //  + $" or (\"FY2019_20\" like {Element} )"
                //  + $" or (\"FY2020_21\" like {Element} )"
                //  + $" or (\"FY2021_22\" like {Element} )"
                //  + $" or (\"FY2022_23\" like {Element} )"
                //  + $" or (\"FY2023_24\" like {Element}) "
                + $" order by \"{sort}\"";
                // Console.WriteLine(query);
            }
            var res2 = _context.Database.SqlQuery<UserDataWithRows>(FormattableStringFactory.Create(query));
            var res1 = await res2.ToListAsync<UserDataWithRows>();
            return Ok(new
            {
                data = res1
            });
        }

    }
}