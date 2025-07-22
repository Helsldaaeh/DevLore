using Microsoft.AspNetCore.Mvc;
using DevLore.EntitiesLibrary.Services;
using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer;
using DevLore.Services;
using DevLore.EntitiesLibrary.Entities;

namespace DevLore.Controllers
{
    [Route("api/post")]
    [ApiController]
    public class PostController(PostService dataEntityService) : Controller
    {

        /// <summary>
        ///     Сервис моделей.
        /// </summary>
        private PostService DataEntityService { get; } = dataEntityService;

        /// <summary>
        ///     Получить список постов.
        ///     Если идентификаторы не указаны, возвращается список со всеми постами.
        ///     Иначе возвращается список с указанными постами, либо пустой список.
        /// </summary>
        /// <param name="ids">Список идентификаторов.</param>
        /// <returns>Результат операции со списком постов.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDTO>>> Get([FromQuery] List<int>? ids)
        {
            var posts = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).Posts, ids)).Select(x => x.ToDTO()).ToList();
            return Ok(posts);
        }

        /// <summary>
        ///     Сохранить посты.
        /// </summary>
        /// <param name="entities">Список постов.</param>
        /// <returns>Результат операции.</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<PostDTO> entities)
        {
            var status = await DataEntityService.Set(((DataContext)DataEntityService.DataContext).Posts, entities.Select(x => x.ToEntity()).ToList());

            if (!status)
            {
                return BadRequest("No posts were saved!");
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
            var status = await DataEntityService.Remove(((DataContext)DataEntityService.DataContext).Posts, ids);

            if (!status)
            {
                return BadRequest("No posts were deleted!");
            }

            return Ok();
        }
    }
}
