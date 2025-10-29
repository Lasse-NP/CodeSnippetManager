using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeSnippetManager.Core.DTO
{
    public class GetTagDTO
    {
        public int? Id { get; set; }
        public required string Name { get; set; }
        public int? SnippetCount { get; set; }
    }
}
