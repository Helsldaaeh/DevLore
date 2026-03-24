using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer.RoleTransferLogic;
using DevLore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevLore.Controllers
{
    [Authorize]
    [Route("api/role")]
    [ApiController]
    public class RoleController(RoleService dataEntityService) : Controller
    {
        private RoleService DataEntityService { get; } = dataEntityService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> Get([FromQuery] List<int>? ids)
        {
            var roles = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).Roles, ids))
                .Select(x => x.ToDTO()).ToList();
            return Ok(roles);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<RequestRoleDTO> entities)
        {
            var status = await DataEntityService.Set(
                ((DataContext)DataEntityService.DataContext).Roles,
                entities.Select(x => x.ToEntity()).ToList());
            if (!status) return BadRequest("No roles were saved!");
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<int> ids)
        {
            var status = await DataEntityService.Remove(
                ((DataContext)DataEntityService.DataContext).Roles, ids);
            if (!status) return BadRequest("No roles were deleted!");
            return Ok();
        }
    }
}