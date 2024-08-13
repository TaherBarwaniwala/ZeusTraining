namespace Chunk_creator.Models
{
    public class UploadChunkDBSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string ChunksCollectionName { get; set; } = null!;

    }
}