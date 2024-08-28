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

        [HttpGet("{rownum}/{sort}")]
        public async Task<ActionResult> GetUserDataCollection(long rownum, string sort = "Email")
        {
            // rownum = (rownum / 1000) * 1000;
            var query = $"with newtable as"
                    + $"("
                    + $"select public.\"UserDatas\".* , row_number() Over( order by {sort}  ) as rownum "
                    + $"from public.\"UserDatas\" "
                    + $") "
                    + $"Select * from newtable order by {sort} LIMIT 1000 OFFSET {rownum}";
            var res = _context.Database.SqlQuery<UserDataWithRows>(FormattableStringFactory.Create(query));
            var resList = await res.ToListAsync<UserDataWithRows>();
            return Ok(new { resList });
        }

        [HttpGet("Find/{Element}/{offset}/{sort}")]
        public async Task<ActionResult> FindUserElement(string Element, string offset, string sort = "Email")
        {
            string query = $"with newtable as"
                    + $"("
                    + $"select public.\"UserDatas\".* , row_number() Over( order by {sort}  ) as rownum "
                    + $"from public.\"UserDatas\" "
                    + $") ";


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
                 + $" or (LOWER(\"DOB\") like \'%{Element}%\') ";
                //  + $" or (\"FY2019_20\" like {Element} )"
                //  + $" or (\"FY2020_21\" like {Element} )"
                //  + $" or (\"FY2021_22\" like {Element} )"
                //  + $" or (\"FY2022_23\" like {Element} )"
                //  + $" or (\"FY2023_24\" like {Element}) "
                // + $" order by \"{sort}\"";
                // Console.WriteLine(query);
            }
            query += $" order by {sort} Limit 1  offset {offset}";
            var res2 = _context.Database.SqlQuery<UserDataWithRows>(FormattableStringFactory.Create(query));
            var res1 = await res2.ToListAsync<UserDataWithRows>();
            return Ok(new
            {
                data = res1
            });
        }

        [HttpGet("FindAll/{Element}/{sort}")]
        public async Task<ActionResult> FindAllUserElement(string Element, string sort = "Email")
        {
            string query = $"with newtable as"
                    + $"("
                    + $"select public.\"UserDatas\".* , row_number() Over( order by {sort}  ) as rownum "
                    + $"from public.\"UserDatas\" "
                    + $") ";


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
                 + $" or (LOWER(\"DOB\") like \'%{Element}%\') ";
                //  + $" or (\"FY2019_20\" like {Element} )"
                //  + $" or (\"FY2020_21\" like {Element} )"
                //  + $" or (\"FY2021_22\" like {Element} )"
                //  + $" or (\"FY2022_23\" like {Element} )"
                //  + $" or (\"FY2023_24\" like {Element}) "
                // + $" order by \"{sort}\"";
                // Console.WriteLine(query);
            }
            var res2 = _context.Database.SqlQuery<UserDataWithRows>(FormattableStringFactory.Create(query));
            var res1 = await res2.ToListAsync<UserDataWithRows>();
            return Ok(new
            {
                data = res1
            });
        }

        [HttpPut("ReplaceAll/{OldString}/{NewString}")]
        public async Task<ActionResult> ReplaceAll(string OldString, string NewString)
        {
            string query;
            if (int.TryParse(OldString, out _))
            {
                query = $"Update public.\"UserDatas\""
                + $"Set \"Email\" = REPLACE(\"Email\",\'{OldString}\',\'{NewString}\') , "
                + $" \"Name\" = REPLACE(\"Name\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"Country\" = REPLACE(\"Country\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"City\" = REPLACE(\"City\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"State\" = REPLACE(\"State\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"TelephoneNumber\" = REPLACE(\"TelephoneNumber\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"AddressLine1\" = REPLACE(\"AddressLine1\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"AddressLine2\" = REPLACE(\"AddressLine2\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"DOB\" = REPLACE(\"DOB\",\'{OldString}\',\'{NewString}\'), "
                + $" \"FY2019_20\" = REPLACE(\"FY2019_20\",{OldString},{NewString}) "
                + $" \"FY2020_21\" = REPLACE(\"FY2020_21\",{OldString},{NewString}) "
                + $" \"FY2021_22\" = REPLACE(\"FY2021_22\",{OldString},{NewString}) "
                + $" \"FY2022_23\" = REPLACE(\"FY2022_23\",{OldString},{NewString}) "
                + $" \"FY2023_24\" = REPLACE(\"FY2023_24\",{OldString},{NewString}) ";
            }
            else
            {
                query = $"Update public.\"UserDatas\""
                + $"Set \"Email\" = REPLACE(\"Email\",\'{OldString}\',\'{NewString}\') , "
                + $" \"Name\" = REPLACE(\"Name\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"Country\" = REPLACE(\"Country\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"City\" = REPLACE(\"City\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"State\" = REPLACE(\"State\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"TelephoneNumber\" = REPLACE(\"TelephoneNumber\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"AddressLine1\" = REPLACE(\"AddressLine1\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"AddressLine2\" = REPLACE(\"AddressLine2\",\'{OldString}\',\'{NewString}\') ,"
                + $" \"DOB\" = REPLACE(\"DOB\",\'{OldString}\',\'{NewString}\') ";
            }
            var res = _context.Database.SqlQuery<string>(FormattableStringFactory.Create(query));
            return Ok(new
            {
                res
            });
        }

    }
}