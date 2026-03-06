using Microsoft.AspNetCore.Mvc;
using DevLore.EntitiesLibrary.Services;
using DevLore.Data;
using DevLore.EntitiesLibrary.Transfer;
using DevLore.Services;
using DevLore.EntitiesLibrary.Entities;
using DevLore.EntitiesLibrary.Transfer.Comment;

namespace DevLore.Controllers
{
    [Route("api/comment")]
    [ApiController]
    public class CommentController(CommentService dataEntityService) : Controller
    {

        /// <summary>
        ///     Сервис моделей.
        /// </summary>
        private CommentService DataEntityService { get; } = dataEntityService;

        /// <summary>
        ///     Получить список постов.
        ///     Если идентификаторы не указаны, возвращается список со всеми постами.
        ///     Иначе возвращается список с указанными постами, либо пустой список.
        /// </summary>
        /// <param name="ids">Список идентификаторов.</param>
        /// <returns>Результат операции со списком постов.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> Get([FromQuery] List<int>? ids)
        {
            var Comments = (await DataEntityService.Get(((DataContext)DataEntityService.DataContext).Comments, ids)).Select(x => x.ToDTO()).ToList();
            return Ok(Comments);
        }

        /// <summary>
        ///     Сохранить посты.
        /// </summary>
        /// <param name="entities">Список постов.</param>
        /// <returns>Результат операции.</returns>
        [HttpPost]
        public async Task<IActionResult> Comment([FromBody] List<RequestCommentDTO> entities)
        {
            var status = await DataEntityService.Set(((DataContext)DataEntityService.DataContext).Comments, entities.Select(x => x.ToEntity()).ToList());

            if (!status)
            {
                return BadRequest("No Comments were saved!");
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
            var status = await DataEntityService.Remove(((DataContext)DataEntityService.DataContext).Comments, ids);

            if (!status)
            {
                return BadRequest("No Comments were deleted!");
            }

            return Ok();
        }
    }
}
