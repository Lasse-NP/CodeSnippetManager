using Microsoft.AspNetCore.Mvc;
using CodeSnippetManager.Core.BusinessLogic;
using CodeSnippetManager.Core.DTO;

namespace CodeSnippetManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiKey]
    public class SnippetsController : ControllerBase
    {
        private readonly ISnippetService _snippetService;
        private readonly ILogger<SnippetsController> _logger;

        public SnippetsController(ISnippetService snippetService, ILogger<SnippetsController> logger)
        {
            _snippetService = snippetService;
            _logger = logger;
        }

        // GET: api/snippets
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<GetSnippetDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<GetSnippetDTO>>> GetAllSnippets()
        {
            try
            {
                var snippets = await _snippetService.GetAllSnippetsAsync();
                return Ok(snippets);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all snippets");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/snippets/{id}
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(GetSnippetDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetSnippetDTO>> GetSnippetById(int id)
        {
            try
            {
                var snippet = await _snippetService.GetSnippetByIdAsync(id);
                if (snippet == null)
                {
                    return NotFound($"Snippet with ID {id} not found");
                }
                return Ok(snippet);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving snippet with ID: {id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/snippets
        [HttpPost]
        [ProducesResponseType(typeof(GetSnippetDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<GetSnippetDTO>> CreateSnippet([FromBody] CreateUpdateSnippetDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdSnippet = await _snippetService.CreateSnippetAsync(dto);
                return CreatedAtAction(nameof(GetSnippetById), new { id = createdSnippet.Id }, createdSnippet);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new snippet");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/snippets/{id}
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(GetSnippetDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<GetSnippetDTO>> UpdateSnippet(int id, [FromBody] CreateUpdateSnippetDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedSnippet = await _snippetService.UpdateSnippetAsync(id, dto);
                if (updatedSnippet == null)
                {
                    return NotFound($"Snippet with ID {id} not found");
                }
                return Ok(updatedSnippet);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating snippet with ID: {id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/snippets/{id}
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteSnippet(int id)
        {
            try
            {
                var result = await _snippetService.DeleteSnippetAsync(id);
                if (!result)
                {
                    return NotFound($"Snippet with ID {id} not found");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting snippet with ID: {id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/snippets/search?query={searchinput}
        [HttpGet("search")]
        [ProducesResponseType(typeof(IEnumerable<GetSnippetDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<GetSnippetDTO>>> SearchSnippets([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty");
            }

            try
            {
                var snippets = await _snippetService.SearchSnippetsAsync(query);
                return Ok(snippets);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error searching snippets with query: {query}", query);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
