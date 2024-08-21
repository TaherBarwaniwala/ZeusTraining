using Microsoft.EntityFrameworkCore;

namespace Excel_Backend.Models
{
    public class FileUploadInMemoryContext : DbContext
    {

        public FileUploadInMemoryContext(DbContextOptions<FileUploadInMemoryContext> options) : base(options)
        {

        }
        public DbSet<FileUpload> FileUploads { get; set; } = null!;
    }
}