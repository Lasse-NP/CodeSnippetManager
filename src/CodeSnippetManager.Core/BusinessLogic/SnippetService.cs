using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeSnippetManager.Core.DTO;
using CodeSnippetManager.Core.Interfaces;
using CodeSnippetManager.Core.ModelLayer;

namespace CodeSnippetManager.Core.BusinessLogic
{
    public class SnippetService : ISnippetService
    {
        private readonly ISnippetRepository _snippetRepository;
        private readonly ITagRepository _tagRepository;

        public SnippetService(ISnippetRepository snippetRepository, ITagRepository tagRepository)
        {
            _snippetRepository = snippetRepository;
            _tagRepository = tagRepository;
        }

        public async Task<GetSnippetDTO> CreateSnippetAsync(CreateUpdateSnippetDTO dto)
        {
            var snippet = MapToNewEntity(dto);

            if (dto.Tags != null && dto.Tags.Any())
            {
                var tags = await _tagRepository.GetOrCreateTagsAsync(dto.Tags);
                snippet.SnippetTags = tags.Select(tag => new SnippetTag
                { Snippet = snippet, Tag = tag }).ToList();
            }

            var result = await _snippetRepository.AddAsync(snippet);
            return MapToDTO(result);
        }

        public async Task<bool> DeleteSnippetAsync(int id)
        {
            bool result = await _snippetRepository.DeleteAsync(id);
            return result;
        }

        public async Task<IEnumerable<GetSnippetDTO>> GetAllSnippetsAsync()
        {
            var snippets = await _snippetRepository.GetAllAsync();
            return snippets.Select(MapToDTO);
        }

        public async Task<GetSnippetDTO?> GetSnippetByIdAsync(int id)
        {
            var snippet = await _snippetRepository.GetByIdAsync(id);
            if (snippet == null) return null;
            return MapToDTO(snippet);
        }

        public async Task<IEnumerable<GetSnippetDTO>> SearchSnippetsAsync(string query)
        {
            var snippets = await _snippetRepository.SearchAsync(query);
            return snippets.Select(MapToDTO);
        }

        public async Task<GetSnippetDTO> UpdateSnippetAsync(int id, CreateUpdateSnippetDTO dto)
        {
            var snippet = await _snippetRepository.GetByIdAsync(id);
            if (snippet == null) return null;

            MapToExistingEntity(snippet, dto);

            if(dto.Tags != null)
            {
                snippet.SnippetTags.Clear();
                var tags = await _tagRepository.GetOrCreateTagsAsync(dto.Tags);
                snippet.SnippetTags = tags.Select(tag => new SnippetTag
                {SnippetId = snippet.Id, Snippet = snippet, TagId = tag.Id, Tag = tag }).ToList();
            }

            await _snippetRepository.UpdateAsync(snippet);
            return MapToDTO(snippet);
        }

        private GetSnippetDTO MapToDTO(Snippet snippet)
        {
            return new GetSnippetDTO
            {
                Id = snippet.Id,
                Title = snippet.Title,
                Code = snippet.Code,
                Language = snippet.Language,
                Description = snippet.Description,
                CreatedAt = snippet.CreatedAt,
                UpdatedAt = snippet.UpdatedAt,
                Tags = snippet.SnippetTags
                    .Select(st => st.Tag.Name)
                    .ToList()
            };
        }

        private Snippet MapToNewEntity(CreateUpdateSnippetDTO dto)
        {
            return new Snippet
            {
                Title = dto.Title,
                Code = dto.Code,
                Language = dto.Language,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        private void MapToExistingEntity(Snippet snippet, CreateUpdateSnippetDTO dto)
        {
            snippet.Title = dto.Title;
            snippet.Code = dto.Code;
            snippet.Language = dto.Language;
            snippet.Description = dto.Description;
            snippet.UpdatedAt = DateTime.UtcNow;
        }
    }
}
