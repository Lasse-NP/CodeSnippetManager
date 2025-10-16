using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeSnippetManager.Core.ModelLayer
{
    public class Tag
    {
        public int? Id { get; set; }
        public required string Name { get; set; }
        public ICollection<SnippetTag> SnippetTags { get; set; } = new List<SnippetTag>();
    }
}
