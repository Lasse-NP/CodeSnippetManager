using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeSnippetManager.Core.DTO
{
    public class CreateUpdateSnippetDTO
    {
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Code snippet is required.")]
        public string Code { get; set; } = string.Empty;

        [Required(ErrorMessage = "Language should be specified.")]
        [MaxLength(50)]
        public string Language { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public List<string> Tags { get; set; } = new();
    }
}
