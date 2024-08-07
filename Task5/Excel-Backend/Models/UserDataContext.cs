using Microsoft.EntityFrameworkCore;

namespace Excel_Backend.Models;

public class UserDataContext : DbContext
{
    public UserDataContext(DbContextOptions<UserDataContext> options) : base(options)
    {

    }

    public DbSet<UserData> UserDatas { get; set; } = null!;

}
