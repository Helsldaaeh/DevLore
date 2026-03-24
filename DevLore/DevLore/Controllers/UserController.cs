using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer.UserTransferLogic;
using DevLore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevLore.Controllers
{
    [Authorize]
    [Route("api/user")]
    [ApiController]
    public class UserController(UserService dataEntityService) : Controller
    {
        private UserService DataEntityService { get; } = dataEntityService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> Get([FromQuery] List<int>? ids)
        {
            var users = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).Users, ids))
                .Select(x => x.ToDTO()).ToList();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<RequestUserDTO> entities)
        {
            var status = await DataEntityService.Set(
                ((DataContext)DataEntityService.DataContext).Users,
                entities.Select(x => x.ToEntity()).ToList());
            if (!status) return BadRequest("No users were saved!");
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<int> ids)
        {
            var status = await DataEntityService.Remove(
                ((DataContext)DataEntityService.DataContext).Users, ids);
            if (!status) return BadRequest("No users were deleted!");
            return Ok();
        }
    }
}