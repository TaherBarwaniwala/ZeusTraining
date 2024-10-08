using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Excel_Backend.Models;

public class FileUpload
{
    [BsonId]
    // [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    [JsonProperty("id")]
    public string? FileId { get; set; }

    public List<string>? ChunkIds { get; set; }

    public string? FileName { get; set; }
}