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
    public class SnippetRepository : ISnippetRepository
    {
        private readonly AppDBContext _context;

        public SnippetRepository(AppDBContext context)
        {
            _context = context;
        }

        public async Task<Snippet> AddAsync(Snippet snippet)
        {
            await _context.Snippets.AddAsync(snippet);
            await _context.SaveChangesAsync();
            return snippet;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var snippet = await _context.Snippets.FindAsync(id);
            if (snippet == null) return false;
            _context.Snippets.Remove(snippet);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Snippet>> GetAllAsync()
        {
            return await _context.Snippets.Include(s => s.SnippetTags).ThenInclude(st => st.Tag).OrderByDescending(s => s.UpdatedAt > s.CreatedAt ? s.UpdatedAt : s.CreatedAt).ToListAsync();
        }

        public async Task<Snippet?> GetByIdAsync(int id)
        {
            return await _context.Snippets.Include(s => s.SnippetTags).ThenInclude(st => st.Tag).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<Snippet>> SearchAsync(string query)
        {
            return await _context.Snippets.Include(s => s.SnippetTags).ThenInclude(st => st.Tag).Where(s => s.Title.Contains(query) || s.Code.Contains(query) || (s.Description != null && s.Description.Contains(query))).ToListAsync();
        }

        public async Task UpdateAsync(Snippet snippet)
        {
            _context.Snippets.Update(snippet);
            await _context.SaveChangesAsync();
        }
    }
}
