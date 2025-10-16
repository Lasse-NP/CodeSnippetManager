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
    public class TagConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {
            builder.ToTable("Tags");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.Id)
                .ValueGeneratedOnAdd();

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasIndex(t => t.Name)
                .IsUnique();

            builder.HasMany(t => t.SnippetTags)
                .WithOne(st => st.Tag)
                .HasForeignKey(st => st.TagId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
