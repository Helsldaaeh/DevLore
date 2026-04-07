using DevLore.Data;
using DevLore.EntitiesLibrary.Entities.Common;
using DevLore.EntitiesLibrary.Transfer.PostTransferLogic;
using DevLore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevLore.Controllers
{
    [Authorize]
    [Route("api/post")]
    [ApiController]
    public class PostController(PostService dataEntityService) : Controller
    {
        private PostService DataEntityService { get; } = dataEntityService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDTO>>> Get(
            [FromQuery] List<int>? ids,
            [FromQuery] int skip = 0,
            [FromQuery] int take = 20)
        {
            var context = (DataContext)DataEntityService.DataContext;
            var query = context.Posts
                .Include(p => p.User)
                .Include(p => p.Tags)
                .Include(p => p.OriginalPost)
                    .ThenInclude(op => op.User)
                .AsQueryable();

            if (ids?.Count > 0)
                query = query.Where(p => ids.Contains(p.Id.GetValueOrDefault()));

            var posts = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
            return Ok(posts.Select(p => p.ToDTO()));
        }

        [HttpGet("feed")]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetFeed(
            [FromQuery] int skip = 0,
            [FromQuery] int take = 20)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var currentUserId))
                return Unauthorized();

            var context = (DataContext)DataEntityService.DataContext;
            var followingIds = await context.Follows
                .Where(f => f.UserId == currentUserId)
                .Select(f => f.FollowedUserId)
                .ToListAsync();

            var query = context.Posts
                .Include(p => p.User)
                .Include(p => p.Tags)
                .Include(p => p.OriginalPost)
                    .ThenInclude(op => op.User)
                .Where(p => followingIds.Contains(p.UserId))
                .OrderByDescending(p => p.CreatedAt);

            var posts = await query
                .Skip(skip)
                .Take(take)
                .ToListAsync();
            return Ok(posts.Select(p => p.ToDTO()));
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PostDTO>>> Search(
            [FromQuery] string? query,
            [FromQuery] string? tags,
            [FromQuery] int? userId,
            [FromQuery] int skip = 0,
            [FromQuery] int take = 20)
        {
            var context = (DataContext)DataEntityService.DataContext;
            var postsQuery = context.Posts
                .Include(p => p.User)
                .Include(p => p.Tags)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
                postsQuery = postsQuery.Where(p => p.Content.Contains(query));

            if (!string.IsNullOrWhiteSpace(tags))
            {
                var tagList = tags.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                   .Select(t => t.Trim())
                                   .ToList();
                postsQuery = postsQuery.Where(p => p.Tags.Any(t => tagList.Contains(t.Name)));
            }

            if (userId.HasValue)
                postsQuery = postsQuery.Where(p => p.UserId == userId.Value);

            var posts = await postsQuery
                .OrderByDescending(p => p.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
            return Ok(posts.Select(p => p.ToDTO()));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<RequestPostDTO> entities)
        {
            var context = (DataContext)DataEntityService.DataContext;
            foreach (var dto in entities)
            {
                var post = dto.ToEntity();
                if (dto.Tags != null && dto.Tags.Any())
                {
                    var tagNames = dto.Tags.Select(t => t.Trim()).Distinct().ToList();
                    var existingTags = await context.Tags.Where(t => tagNames.Contains(t.Name)).ToListAsync();
                    var newTagNames = tagNames.Except(existingTags.Select(t => t.Name)).ToList();
                    foreach (var newName in newTagNames)
                    {
                        existingTags.Add(new Tag { Name = newName });
                    }
                    post.Tags = existingTags;
                }
                context.Posts.Add(post);
            }
            var status = await context.SaveChangesAsync() > 0;
            if (!status) return BadRequest("No posts were saved!");
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RequestPostDTO dto)
        {
            var context = (DataContext)DataEntityService.DataContext;
            var post = await context.Posts.Include(p => p.Tags).FirstOrDefaultAsync(p => p.Id == id);
            if (post == null) return NotFound();

            post.Content = dto.Content;
            post.Type = dto.Type;
            post.OriginalPostId = dto.OriginalPostId;

            if (dto.Tags != null)
            {
                var tagNames = dto.Tags.Select(t => t.Trim()).Distinct().ToList();
                var existingTags = await context.Tags.Where(t => tagNames.Contains(t.Name)).ToListAsync();
                var newTagNames = tagNames.Except(existingTags.Select(t => t.Name)).ToList();
                foreach (var newName in newTagNames)
                {
                    existingTags.Add(new Tag { Name = newName });
                }
                post.Tags = existingTags;
            }
            else
            {
                post.Tags.Clear();
            }

            await context.SaveChangesAsync();
            return Ok(post.ToDTO());
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<int> ids)
        {
            var context = (DataContext)DataEntityService.DataContext;
            var postsToDelete = await context.Posts.Where(p => ids.Contains(p.Id.GetValueOrDefault())).ToListAsync();
            context.Posts.RemoveRange(postsToDelete);
            var status = await context.SaveChangesAsync() > 0;
            if (!status) return BadRequest("No posts were deleted!");
            return Ok();
        }
    }
}