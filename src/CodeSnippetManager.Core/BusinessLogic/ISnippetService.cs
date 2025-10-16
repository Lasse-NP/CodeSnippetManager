using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeSnippetManager.Core.DTO;

namespace CodeSnippetManager.Core.BusinessLogic
{
    public interface ISnippetService
    {
        Task<GetSnippetDTO?> GetSnippetByIdAsync(int id);
        Task<IEnumerable<GetSnippetDTO>> GetAllSnippetsAsync();
        Task<GetSnippetDTO> CreateSnippetAsync(CreateUpdateSnippetDTO dto);
        Task<GetSnippetDTO?> UpdateSnippetAsync(int id, CreateUpdateSnippetDTO dto);
        Task<bool> DeleteSnippetAsync(int id);
        Task<IEnumerable<GetSnippetDTO>> SearchSnippetsAsync(string query);
    }
}
