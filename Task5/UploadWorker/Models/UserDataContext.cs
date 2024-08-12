using Microsoft.EntityFrameworkCore;

namespace UploadWorker.Models;

public class UserDataContext : DbContext
{
    public UserDataContext(DbContextOptions<UserDataContext> options) : base(options)
    {

    }

    public DbSet<UserData> UserDatas { get; set; } = null!;

}
