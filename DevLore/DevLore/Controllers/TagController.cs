using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer.TagTransferLogic;
using DevLore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevLore.Controllers
{
    [Authorize]
    [Route("api/tag")]
    [ApiController]
    public class TagController(TagService dataEntityService) : Controller
    {
        private TagService DataEntityService { get; } = dataEntityService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDTO>>> Get([FromQuery] List<int>? ids)
        {
            var tags = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).Tags, ids))
                .Select(x => x.ToDTO()).ToList();
            return Ok(tags);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<RequestTagDTO> entities)
        {
            var status = await DataEntityService.Set(
                ((DataContext)DataEntityService.DataContext).Tags,
                entities.Select(x => x.ToEntity()).ToList());
            if (!status) return BadRequest("No tags were saved!");
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<int> ids)
        {
            var status = await DataEntityService.Remove(
                ((DataContext)DataEntityService.DataContext).Tags, ids);
            if (!status) return BadRequest("No tags were deleted!");
            return Ok();
        }
    }
}