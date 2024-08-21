using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Excel_Backend.Models
{
    public class UploadChunk
    {
        [BsonId]
        // [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [JsonProperty("id")]
        public string? UploadChunkId { get; set; }

        public string? FileId { get; set; }

        public string? Status { get; set; }

    }
}