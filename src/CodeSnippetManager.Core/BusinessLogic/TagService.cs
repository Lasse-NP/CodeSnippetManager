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
    public class TagService : ITagService
    {
        private readonly ITagRepository _tagRepository;

        public TagService(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task<GetTagDTO> CreateTagAsync(GetTagDTO dto)
        {
            var tag = MapToNewEntity(dto);
            var result = await _tagRepository.AddAsync(tag);
            return MapToDTO(result);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            bool result = await _tagRepository.DeleteAsync(id);
            return result;
        }

        public async Task<int> DeleteOrphanedTagsAsync()
        {
            var result = await _tagRepository.DeleteOrphanedTagsAsync();
            return result;
        }

        public async Task<IEnumerable<GetTagDTO>> GetAllTagsAsync()
        {
            var tags = await _tagRepository.GetAllAsync();
            return tags.Select(MapToDTO);
        }

        public async Task<GetTagDTO?> GetTagByIdAsync(int id)
        {
            var tag = await _tagRepository.GetByIdAsync(id);
            if (tag == null) return null;
            return MapToDTO(tag);
        }

        public async Task<GetTagDTO?> GetTagByNameAsync(string name)
        {
            var tag = await _tagRepository.GetByNameAsync(name);
            if (tag == null) return null;
            return MapToDTO(tag);
        }

        public async Task<GetTagDTO?> UpdateTagAsync(int id, GetTagDTO dto)
        {
            var tag = await _tagRepository.GetByIdAsync(id);
            if (tag == null) return null;

            MapToExistingEntity(tag, dto);

            await _tagRepository.UpdateAsync(tag);
            return MapToDTO(tag);
        }

        private GetTagDTO MapToDTO(Tag tag)
        {
            return new GetTagDTO
            {
                Id = tag.Id,
                Name = tag.Name,
                SnippetCount = tag.SnippetTags.Count,
            };
        }

        private Tag MapToNewEntity(GetTagDTO dto)
        {
            return new Tag
            {
                Id = dto.Id,
                Name = dto.Name
            };
        }

        private void MapToExistingEntity(Tag tag, GetTagDTO dto)
        {
            tag.Id = dto.Id;
            tag.Name = dto.Name;
        }
    }
}
