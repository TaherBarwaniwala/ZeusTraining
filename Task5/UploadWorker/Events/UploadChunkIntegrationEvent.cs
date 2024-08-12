using UploadWorker.Models;
namespace UploadWorker.Events
{
    public class UploadChunkIntergrationEvent
    {
        public UploadChunk uploadChunk { get; set; }

        public UploadChunkIntergrationEvent(UploadChunk uploadChunk)
        {
            this.uploadChunk = uploadChunk;
        }
    }
}