using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeSnippetManager.Core.Interfaces;
using CodeSnippetManager.Core.ModelLayer;
using CodeSnippetManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeSnippetManager.Infrastructure.Repositories
{
    public class TagRepository : ITagRepository
    {
        private readonly AppDBContext _context;

        public TagRepository(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Tag> AddAsync(Tag tag)
        {
            await _context.Tags.AddAsync(tag);
            await _context.SaveChangesAsync();
            return tag;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var tag = _context.Tags.Find(id);
            if (tag == null) return false;
            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Tag>> GetAllAsync()
        {
            return await _context.Tags.OrderBy(t => t.Name).ToListAsync();
        }

        public async Task<Tag?> GetByIdAsync(int id)
        {
            return await _context.Tags.FindAsync(id);
        }

        public async Task<Tag?> GetByNameAsync(string name)
        {
            return await _context.Tags.FirstOrDefaultAsync(t => t.Name == name);
        }

        public async Task UpdateAsync(Tag tag)
        {
            _context.Tags.Update(tag);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Tag>> GetOrCreateTagsAsync(List<string> tagNames)
        {
            var tags = new List<Tag>();

            foreach (var tagName in tagNames.Distinct())
            {
                var existingTag = await GetByNameAsync(tagName);

                if (existingTag != null)
                {
                    tags.Add(existingTag);
                }
                else
                {
                    var newTag = new Tag { Name = tagName };
                    var createdTag = await AddAsync(newTag);
                    tags.Add(createdTag);
                }
            }
            return tags;
        }
    }
}
