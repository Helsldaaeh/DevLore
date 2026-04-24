using DevLore.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DevLore.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;

        public AdminController(DataContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var id) ? id : 0;
        }

        // ==================== USERS ====================
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(
            [FromQuery] string? search,
            [FromQuery] string? sortBy = "Id",
            [FromQuery] string? order = "asc",
            [FromQuery] int skip = 0,
            [FromQuery] int take = 20)
        {
            var query = _context.Users.Include(u => u.Role).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u => u.Username.Contains(search) || u.Email.Contains(search));
            }

            query = sortBy?.ToLower() switch
            {
                "username" => order == "asc" ? query.OrderBy(u => u.Username) : query.OrderByDescending(u => u.Username),
                "email" => order == "asc" ? query.OrderBy(u => u.Email) : query.OrderByDescending(u => u.Email),
                "createdat" => order == "asc" ? query.OrderBy(u => u.CreatedAt) : query.OrderByDescending(u => u.CreatedAt),
                _ => order == "asc" ? query.OrderBy(u => u.Id) : query.OrderByDescending(u => u.Id)
            };

            var total = await query.CountAsync();
            var users = await query
                .Skip(skip)
                .Take(take)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Profile,
                    RoleName = u.Role!.Name,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(new { items = users, total });
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> SetUserRole(int id, [FromBody] string roleName)
        {
            var currentUserId = GetCurrentUserId();
            var targetUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (targetUser == null) return NotFound();

            if (targetUser.Id == currentUserId)
                return BadRequest(new { message = "You cannot change your own role." });

            if (targetUser.Role?.Name == "Admin")
                return BadRequest(new { message = "Cannot change role of another admin." });

            var newRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
            if (newRole == null) return BadRequest("Role not found");

            targetUser.RoleId = newRole.Id.Value;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var currentUserId = GetCurrentUserId();
            var targetUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (targetUser == null) return NotFound();

            if (targetUser.Id == currentUserId)
                return BadRequest(new { message = "You cannot delete your own account." });

            if (targetUser.Role?.Name == "Admin")
                return BadRequest(new { message = "Cannot delete another admin." });

            _context.Users.Remove(targetUser);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("users/batch")]
        public async Task<IActionResult> DeleteUsers([FromBody] List<int> ids)
        {
            var currentUserId = GetCurrentUserId();
            var usersToDelete = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Id.HasValue && ids.Contains(u.Id.Value))
                .ToListAsync();

            foreach (var user in usersToDelete)
            {
                if (user.Id == currentUserId)
                    return BadRequest(new { message = "You cannot delete your own account." });
                if (user.Role?.Name == "Admin")
                    return BadRequest(new { message = "Cannot delete another admin." });
            }

            _context.Users.RemoveRange(usersToDelete);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ==================== POSTS ====================
        [HttpGet("posts")]
        public async Task<IActionResult> GetPosts(
            [FromQuery] string? search,
            [FromQuery] string? author,
            [FromQuery] string? tag,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] string? order = "desc",
            [FromQuery] int skip = 0,
            [FromQuery] int take = 20)
        {
            var query = _context.Posts
                .Include(p => p.User)
                .Include(p => p.Tags)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Content.Contains(search));
            if (!string.IsNullOrWhiteSpace(author))
                query = query.Where(p => p.User!.Username.Contains(author));
            if (!string.IsNullOrWhiteSpace(tag))
                query = query.Where(p => p.Tags.Any(t => t.Name == tag));
            if (from.HasValue)
                query = query.Where(p => p.CreatedAt >= from);
            if (to.HasValue)
                query = query.Where(p => p.CreatedAt <= to);

            query = sortBy?.ToLower() switch
            {
                "content" => order == "asc" ? query.OrderBy(p => p.Content) : query.OrderByDescending(p => p.Content),
                "username" => order == "asc" ? query.OrderBy(p => p.User!.Username) : query.OrderByDescending(p => p.User!.Username),
                _ => order == "asc" ? query.OrderBy(p => p.CreatedAt) : query.OrderByDescending(p => p.CreatedAt)
            };

            var total = await query.CountAsync();
            var posts = await query
                .Skip(skip)
                .Take(take)
                .Select(p => new
                {
                    p.Id,
                    p.Content,
                    AuthorUsername = p.User!.Username,
                    p.CreatedAt,
                    p.Type,
                    Tags = p.Tags!.Select(t => t.Name).ToList()
                })
                .ToListAsync();

            return Ok(new { items = posts, total });
        }

        [HttpDelete("posts/{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("posts/batch")]
        public async Task<IActionResult> DeletePosts([FromBody] List<int> ids)
        {
            var postsToDelete = await _context.Posts
                .Where(p => p.Id.HasValue && ids.Contains(p.Id.Value))
                .ToListAsync();
            _context.Posts.RemoveRange(postsToDelete);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ==================== COMMENTS ====================
        [HttpGet("comments")]
        public async Task<IActionResult> GetComments(
            [FromQuery] string? search,
            [FromQuery] string? author,
            [FromQuery] string? postContent,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int skip = 0,
            [FromQuery] int take = 20)
        {
            var query = _context.Comments
                .Include(c => c.User)
                .Include(c => c.Post)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(c => c.Content.Contains(search));
            if (!string.IsNullOrWhiteSpace(author))
                query = query.Where(c => c.User!.Username.Contains(author));
            if (!string.IsNullOrWhiteSpace(postContent))
                query = query.Where(c => c.Post!.Content.Contains(postContent));
            if (from.HasValue)
                query = query.Where(c => c.CreatedAt >= from);
            if (to.HasValue)
                query = query.Where(c => c.CreatedAt <= to);

            var total = await query.CountAsync();
            var comments = await query
                .Skip(skip)
                .Take(take)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    AuthorUsername = c.User!.Username,
                    PostId = c.PostId,
                    PostContent = c.Post!.Content,
                    c.CreatedAt
                })
                .ToListAsync();

            return Ok(new { items = comments, total });
        }

        [HttpDelete("comments/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("comments/batch")]
        public async Task<IActionResult> DeleteComments([FromBody] List<int> ids)
        {
            var commentsToDelete = await _context.Comments
                .Where(c => c.Id.HasValue && ids.Contains(c.Id.Value))
                .ToListAsync();
            _context.Comments.RemoveRange(commentsToDelete);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ==================== STATS ====================
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var usersCount = await _context.Users.CountAsync();
            var postsCount = await _context.Posts.CountAsync();
            var commentsCount = await _context.Comments.CountAsync();
            var reactionsCount = await _context.Reactions.CountAsync();

            return Ok(new
            {
                Users = usersCount,
                Posts = postsCount,
                Comments = commentsCount,
                Reactions = reactionsCount
            });
        }
    }
}