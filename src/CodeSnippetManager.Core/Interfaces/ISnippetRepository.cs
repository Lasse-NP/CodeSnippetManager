using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeSnippetManager.Core.ModelLayer;

namespace CodeSnippetManager.Core.Interfaces
{
    public interface ISnippetRepository
    {
        Task<Snippet?> GetByIdAsync(int id);
        Task<IEnumerable<Snippet>> GetAllAsync();
        Task<IEnumerable<Snippet>> SearchAsync(string query);
        Task<Snippet> AddAsync(Snippet snippet);
        Task UpdateAsync(Snippet snippet);
        Task<bool> DeleteAsync(int id);
    }
}
