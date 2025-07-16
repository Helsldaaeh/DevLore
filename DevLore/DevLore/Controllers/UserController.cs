using Microsoft.AspNetCore.Mvc;
using DevLore.EntitiesLibrary.Services;
using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer;
using DevLore.Services;
using DevLore.EntitiesLibrary.Entities;

namespace DevLore.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController(UserService dataEntityService) : Controller
    {

        /// <summary>
        ///     Сервис моделей.
        /// </summary>
        private UserService DataEntityService { get; } = dataEntityService;

        /// <summary>
        ///     Получить список постов.
        ///     Если идентификаторы не указаны, возвращается список со всеми постами.
        ///     Иначе возвращается список с указанными постами, либо пустой список.
        /// </summary>
        /// <param name="ids">Список идентификаторов.</param>
        /// <returns>Результат операции со списком постов.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> Get([FromQuery] string userId, [FromQuery] List<int>? ids)
        {
            var users = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).Users, ids)).Select(x => x.ToDTO()).ToList();
            return Ok(users);
        }

        /// <summary>
        ///     Сохранить посты.
        /// </summary>
        /// <param name="entities">Список постов.</param>
        /// <returns>Результат операции.</returns>
        [HttpPost]
        public async Task<IActionResult> User([FromBody] List<RequestUserDTO> entities)
        {
            var status = await DataEntityService.Set(((DataContext)DataEntityService.DataContext).Users, entities.Select(x => x.ToEntity()).ToList());

            if (!status)
            {
                return BadRequest("No users were saved!");
            }

            return Ok();
        }

        /// <summary>
        ///     Удалить растения.
        /// </summary>
        /// <param name="ids">Список идентификаторов.</param>
        /// <returns>Результат операции.</returns>
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<int> ids)
        {
            var status = await DataEntityService.Remove(((DataContext)DataEntityService.DataContext).Users, ids);

            if (!status)
            {
                return BadRequest("No users were deleted!");
            }

            return Ok();
        }
    }
}
