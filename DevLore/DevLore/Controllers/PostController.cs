using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer.PostTransferLogic;
using DevLore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            var posts = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).Posts, ids))
                .Select(x => x.ToDTO()).ToList();
            return Ok(posts);
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