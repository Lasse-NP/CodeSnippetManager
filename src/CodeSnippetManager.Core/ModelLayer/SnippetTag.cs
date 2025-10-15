using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeSnippetManager.Core.ModelLayer
{
    public class SnippetTag
    {
        public int? SnippetId { get; set; }
        public required Snippet Snippet { get; set; }
        public int? TagId { get; set; }
        public required Tag Tag { get; set; }
    }
}
