namespace Chunk_creator.Models
{
    public class FileUploadDBSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string FilesCollectionName { get; set; } = null!;

    }
}