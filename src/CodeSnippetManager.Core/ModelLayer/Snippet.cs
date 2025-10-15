using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeSnippetManager.Core.ModelLayer
{
    public class Snippet
    {
        public int? Id { get; set; }
        public required string Title { get; set; }
        public required string Code { get; set; }
        public required string Language { get; set; }
        public string? Description { get; set; }
        public required DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ICollection<SnippetTag> SnippetTags { get; set; } = new List<SnippetTag>();
    }
}
