using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer.FollowTransferLogic;
using DevLore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevLore.Controllers
{
    [Authorize]
    [Route("api/follow")]
    [ApiController]
    public class FollowController(FollowService dataEntityService) : Controller
    {
        private FollowService DataEntityService { get; } = dataEntityService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FollowDTO>>> Get([FromQuery] List<int>? ids)
        {
            var follows = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).Follows, ids))
                .Select(x => x.ToDTO()).ToList();
            return Ok(follows);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<RequestFollowDTO> entities)
        {
            var status = await DataEntityService.Set(
                ((DataContext)DataEntityService.DataContext).Follows,
                entities.Select(x => x.ToEntity()).ToList());
            if (!status) return BadRequest("No follows were saved!");
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<int> ids)
        {
            var status = await DataEntityService.Remove(
                ((DataContext)DataEntityService.DataContext).Follows, ids);
            if (!status) return BadRequest("No follows were deleted!");
            return Ok();
        }
    }
}