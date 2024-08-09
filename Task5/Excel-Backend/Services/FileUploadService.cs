using Excel_Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Excel_Backend.Services
{
    public class FileUploadService
    {
        private readonly IMongoCollection<FileUpload> _fileCollection;

        public FileUploadService(
            IOptions<FileUploadDBSettings> uploadFileDBSettings
        )
        {
            var mongoClient = new MongoClient(uploadFileDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(uploadFileDBSettings.Value.DatabaseName);
            _fileCollection = mongoDatabase.GetCollection<FileUpload>(uploadFileDBSettings.Value.FilesCollectionName);
        }
        public async Task<List<FileUpload>> GetAsync()
        {
            return await _fileCollection.Find<FileUpload>(_ => true).ToListAsync<FileUpload>();
        }

        public async Task<FileUpload?> GetAsync(string Id)
        {
            return await _fileCollection.Find<FileUpload>(x => x.FileId == Id).FirstOrDefaultAsync<FileUpload>(); ;
        }

        public async Task CreateASync(FileUpload file)
        {
            await _fileCollection.InsertOneAsync(file);
        }

        public async Task UpdateAsync(string Id, FileUpload file)
        {
            await _fileCollection.ReplaceOneAsync<FileUpload>(x => x.FileId == Id, file);
        }

    }
}