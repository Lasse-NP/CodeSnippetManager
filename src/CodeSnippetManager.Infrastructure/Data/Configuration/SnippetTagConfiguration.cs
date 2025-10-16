using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeSnippetManager.Core.ModelLayer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodeSnippetManager.Infrastructure.Data.Configuration
{
    public class SnippetTagConfiguration : IEntityTypeConfiguration<SnippetTag>
    {
        public void Configure(EntityTypeBuilder<SnippetTag> builder)
        {
            builder.ToTable("SnippetTags");

            builder.HasKey(st => new { st.SnippetId, st.TagId });

            builder.HasOne(st => st.Snippet)
                .WithMany(s => s.SnippetTags)
                .HasForeignKey(st => st.SnippetId);

            builder.HasOne(st => st.Tag)
                .WithMany(t => t.SnippetTags)
                .HasForeignKey(st => st.TagId);
        }
    }
}
