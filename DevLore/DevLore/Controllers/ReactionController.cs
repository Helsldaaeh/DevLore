using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer.LikeOrDislikeTransferLogic;
using DevLore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevLore.Controllers
{
    [Authorize]
    [Route("api/reaction")]
    [ApiController]
    public class ReactionController(ReactionService dataEntityService) : Controller
    {
        private ReactionService DataEntityService { get; } = dataEntityService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReactionDTO>>> Get([FromQuery] List<int>? ids)
        {
            var reactions = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).Reactions, ids))
                .Select(x => x.ToDTO()).ToList();
            return Ok(reactions);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<RequestReactionDTO> entities)
        {
            var status = await DataEntityService.Set(
                ((DataContext)DataEntityService.DataContext).Reactions,
                entities.Select(x => x.ToEntity()).ToList());
            if (!status) return BadRequest("No reactions were saved!");
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<int> ids)
        {
            var status = await DataEntityService.Remove(
                ((DataContext)DataEntityService.DataContext).Reactions, ids);
            if (!status) return BadRequest("No reactions were deleted!");
            return Ok();
        }
    }
}