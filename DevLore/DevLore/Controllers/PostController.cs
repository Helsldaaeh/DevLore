using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer.PostTransferLogic;
using DevLore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.Controllers
{
    [Authorize]
    [Route("api/post")]
    [ApiController]
    public class PostController(PostService dataEntityService) : Controller
    {
        private PostService DataEntityService { get; } = dataEntityService;
[HttpGet]
public async Task<ActionResult<IEnumerable<PostDTO>>> Get([FromQuery] List<int>? ids)
{
    IQueryable<Post> query = ((DataContext)DataEntityService.DataContext).Posts.Include(p => p.User);
    if (ids?.Count > 0)
        query = query.Where(p => ids.Contains(p.Id.GetValueOrDefault()));
    var posts = await query.ToListAsync();
    return Ok(posts.Select(p => p.ToDTO()));
}

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<RequestPostDTO> entities)
        {
            var status = await DataEntityService.Set(
                ((DataContext)DataEntityService.DataContext).Posts,
                entities.Select(x => x.ToEntity()).ToList());
            if (!status) return BadRequest("No posts were saved!");
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<int> ids)
        {
            var status = await DataEntityService.Remove(
                ((DataContext)DataEntityService.DataContext).Posts, ids);
            if (!status) return BadRequest("No posts were deleted!");
            return Ok();
        }
    }
    
}