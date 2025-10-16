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
    public class SnippetConfiguration : IEntityTypeConfiguration<Snippet>
    {
        public void Configure(EntityTypeBuilder<Snippet> builder)
        {
            builder.ToTable("Snippets");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Id)
                .ValueGeneratedOnAdd();

            builder.Property(s => s.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(s => s.Code)
                .IsRequired()
                .HasColumnType("NVARCHAR(MAX)");

            builder.Property(s => s.Language)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(s => s.Description)
                .HasMaxLength(1000);

            builder.Property(s => s.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(s => s.UpdatedAt)
                .IsRequired(false);

            builder.HasMany(s => s.SnippetTags)
                .WithOne(st => st.Snippet)
                .HasForeignKey(st => st.SnippetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
