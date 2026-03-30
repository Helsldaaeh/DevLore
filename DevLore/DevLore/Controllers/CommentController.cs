using DevLore.Data;
using DevLore.EntitiesLibrary.Entities.Common;
using DevLore.EntitiesLibrary.Transfer.CommentTransferLogic;
using DevLore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevLore.Controllers
{
    [Authorize]
    [Route("api/comment")]
    [ApiController]
    public class CommentController(CommentService dataEntityService) : Controller
    {
        private CommentService DataEntityService { get; } = dataEntityService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> Get([FromQuery] List<int>? ids)
        {
            var context = (DataContext)DataEntityService.DataContext;
            var query = context.Comments
                .Include(c => c.User)
                .AsQueryable();

            if (ids?.Count > 0)
                query = query.Where(c => ids.Contains(c.Id.GetValueOrDefault()));

            var comments = await query.ToListAsync();
            return Ok(comments.Select(c => c.ToDTO()));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<RequestCommentDTO> entities)
        {
            var status = await DataEntityService.Set(
                ((DataContext)DataEntityService.DataContext).Comments,
                entities.Select(x => x.ToEntity()).ToList());
            if (!status) return BadRequest("No comments were saved!");
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<int> ids)
        {
            var status = await DataEntityService.Remove(
                ((DataContext)DataEntityService.DataContext).Comments, ids);
            if (!status) return BadRequest("No comments were deleted!");
            return Ok();
        }
    }
}