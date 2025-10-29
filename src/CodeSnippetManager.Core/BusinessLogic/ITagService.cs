using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeSnippetManager.Core.DTO;
using CodeSnippetManager.Core.ModelLayer;

namespace CodeSnippetManager.Core.BusinessLogic
{
    public interface ITagService
    {
        Task<IEnumerable<GetTagDTO>> GetAllTagsAsync();
        Task<GetTagDTO?> GetTagByIdAsync(int id);
        Task<GetTagDTO?> GetTagByNameAsync(string name);
        Task<bool> DeleteAsync(int id);
        Task<int> DeleteOrphanedTagsAsync();
        Task<GetTagDTO> CreateTagAsync(GetTagDTO dto);
        Task<GetTagDTO?> UpdateTagAsync(int id, GetTagDTO dto);
    }
}
