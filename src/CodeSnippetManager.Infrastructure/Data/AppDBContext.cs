using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeSnippetManager.Core.ModelLayer;
using Microsoft.EntityFrameworkCore;

namespace CodeSnippetManager.Infrastructure.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {
        }

        public DbSet<Snippet> Snippets { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<SnippetTag> SnippetTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDBContext).Assembly);
        }
    }
}
