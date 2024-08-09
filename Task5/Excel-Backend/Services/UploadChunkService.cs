using Excel_Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Excel_Backend.Services
{
    public class UploadChunkService
    {
        private readonly IMongoCollection<UploadChunk> _chunkCollection;

        public UploadChunkService(
            IOptions<UploadChunkDBSettings> uploadChunkDBSettings
        )
        {
            var mongoClient = new MongoClient(uploadChunkDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(uploadChunkDBSettings.Value.DatabaseName);
            _chunkCollection = mongoDatabase.GetCollection<UploadChunk>(uploadChunkDBSettings.Value.ChunksCollectionName);
        }
        public async Task<List<UploadChunk>> GetAsync()
        {
            return await _chunkCollection.Find<UploadChunk>(_ => true).ToListAsync<UploadChunk>();
        }

        public async Task<UploadChunk?> GetAsync(string Id)
        {
            return await _chunkCollection.Find<UploadChunk>(x => x.UploadChunkId == Id).FirstOrDefaultAsync<UploadChunk>(); ;
        }

        public async Task CreateASync(UploadChunk chunk)
        {
            await _chunkCollection.InsertOneAsync(chunk);
        }

        public async Task UpdateAsync(string Id, UploadChunk chunk)
        {
            await _chunkCollection.ReplaceOneAsync<UploadChunk>(x => x.UploadChunkId == Id, chunk);
        }

    }
}