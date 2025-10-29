using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeSnippetManager.Core.ModelLayer;

namespace CodeSnippetManager.Core.Interfaces
{
    public interface ITagRepository
    {
        Task<Tag?> GetByIdAsync(int id);
        Task<Tag?> GetByNameAsync(string name);
        Task<IEnumerable<Tag>> GetAllAsync();
        Task<Tag> AddAsync(Tag tag);
        Task UpdateAsync(Tag tag);
        Task<bool> DeleteAsync(int id);
        Task<int> DeleteOrphanedTagsAsync();
        Task<List<Tag>> GetOrCreateTagsAsync(List<string> tagNames);
    }
}
