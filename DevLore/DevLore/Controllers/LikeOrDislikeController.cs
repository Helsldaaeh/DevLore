using Microsoft.AspNetCore.Mvc;
using DevLore.EntitiesLibrary.Services;
using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer;
using DevLore.Services;
using DevLore.EntitiesLibrary.Entities;
using DevLore.EntitiesLibrary.Transfer.LikeOrDislike;

namespace DevLore.Controllers
{
    [Route("api/likeordislike")]
    [ApiController]
    public class LikeOrDislikeController(LikeOrDislikeService dataEntityService) : Controller
    {

        /// <summary>
        ///     Сервис моделей.
        /// </summary>
        private LikeOrDislikeService DataEntityService { get; } = dataEntityService;

        /// <summary>
        ///     Получить список постов.
        ///     Если идентификаторы не указаны, возвращается список со всеми постами.
        ///     Иначе возвращается список с указанными постами, либо пустой список.
        /// </summary>
        /// <param name="ids">Список идентификаторов.</param>
        /// <returns>Результат операции со списком постов.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeOrDislikeDTO>>> Get([FromQuery] List<int>? ids)
        {
            var LikeOrDislikes = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).LikeOrDislikes, ids)).Select(x => x.ToDTO()).ToList();
            return Ok(LikeOrDislikes);
        }

        /// <summary>
        ///     Сохранить посты.
        /// </summary>
        /// <param name="entities">Список постов.</param>
        /// <returns>Результат операции.</returns>
        [HttpPost]
        public async Task<IActionResult> LikeOrDislike([FromBody] List<RequestLikeOrDislikeDTO> entities)
        {
            var status = await DataEntityService.Set(((DataContext)DataEntityService.DataContext).LikeOrDislikes, entities.Select(x => x.ToEntity()).ToList());

            if (!status)
            {
                return BadRequest("No LikeOrDislikes were saved!");
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
                return BadRequest("No LikeOrDislikes were deleted!");
            }

            return Ok();
        }
    }
}
