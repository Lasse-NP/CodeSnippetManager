using CodeSnippetManager.Core.DTO;
using Microsoft.AspNetCore.Mvc;
using CodeSnippetManager.Core.BusinessLogic;

namespace CodeSnippetManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiKey]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _tagService;
        private readonly ILogger<TagsController> _logger;

        public TagsController(ITagService tagService, ILogger<TagsController> logger)
        {
            _tagService = tagService;
            _logger = logger;
        }

        // GET: api/tags
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<GetTagDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<GetTagDTO>>> GetAllTags()
        {
            try
            {
                var tags = await _tagService.GetAllTagsAsync();
                return Ok(tags);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all tags");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tags/byId/{id}
        [HttpGet("byId/{id}")]
        [ProducesResponseType(typeof(GetTagDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetTagDTO>> GetTagById(int id)
        {
            try
            {
                var tag = await _tagService.GetTagByIdAsync(id);
                if (tag == null)
                {
                    return NotFound($"Tag with ID {id} not found");
                }
                return Ok(tag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving tag with ID: {id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tags/byName/{name}
        [HttpGet("byName/{name}")]
        [ProducesResponseType(typeof(GetTagDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetTagDTO>> GetTagByName(string name)
        {
            try
            {
                var tag = await _tagService.GetTagByNameAsync(name);
                if (tag == null)
                {
                    return NotFound($"Tag with name '{name}' not found");
                }
                return Ok(tag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving tag with name: {name}", name);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/tags
        [HttpPost]
        [ProducesResponseType(typeof(GetTagDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<GetTagDTO>> CreateTag([FromBody] GetTagDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdTag = await _tagService.CreateTagAsync(dto);
                return CreatedAtAction(nameof(GetTagById), new { id = createdTag.Id }, createdTag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new tag");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/tags/{id}
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(GetTagDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<GetTagDTO>> UpdateTag(int id, [FromBody] GetTagDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedTag = await _tagService.UpdateTagAsync(id, dto);
                if (updatedTag == null)
                {
                    return NotFound($"Tag with ID {id} not found");
                }
                return Ok(updatedTag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating tag with ID: {id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/tags/{id}
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTag(int id)
        {
            try
            {
                var result = await _tagService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound($"Tag with ID {id} not found");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting tag with ID: {id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("removeOrphaned")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> CleanupOrphanedTags()
        {
            try
            {
                var deletedCount = await _tagService.DeleteOrphanedTagsAsync();
                _logger.LogInformation($"Cleaned up {deletedCount} orphaned tags");
                return Ok(new { message = $"Deleted {deletedCount} orphaned tags", count = deletedCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up orphaned tags");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
