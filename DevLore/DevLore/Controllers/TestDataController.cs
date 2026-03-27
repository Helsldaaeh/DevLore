using DevLore.Data;
using DevLore.EntitiesLibrary.Entities.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevLore.Controllers
{
    [Route("api/test")]
    [ApiController]
    public class TestDataController : ControllerBase
    {
        private readonly DataContext _context;

        public TestDataController(DataContext context)
        {
            _context = context;
        }

        public class GenerateRequest
        {
            public int Users { get; set; } = 10;
            public int PostsPerUser { get; set; } = 5;
            public int CommentsPerPost { get; set; } = 3;
            public int ReactionsPerPost { get; set; } = 5;
        }

        // POST-метод (для API-клиентов)
        [HttpPost("generate")]
        public async Task<IActionResult> GeneratePost([FromBody] GenerateRequest request)
        {
            return await GenerateData(request);
        }

        // GET-метод (для браузера)
        [HttpGet("generate")]
        public async Task<IActionResult> GenerateGet(
            [FromQuery] int users = 10,
            [FromQuery] int postsPerUser = 5,
            [FromQuery] int commentsPerPost = 3,
            [FromQuery] int reactionsPerPost = 5)
        {
            var request = new GenerateRequest
            {
                Users = users,
                PostsPerUser = postsPerUser,
                CommentsPerPost = commentsPerPost,
                ReactionsPerPost = reactionsPerPost
            };
            return await GenerateData(request);
        }

        private async Task<IActionResult> GenerateData(GenerateRequest request)
        {
            try
            {
                var random = new Random();
                var userNames = new[] { "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack" };
                var domains = new[] { "gmail.com", "yandex.ru", "mail.ru", "outlook.com" };
                var words = new[] { "code", "blog", "post", "dev", "react", "dotnet", "typescript", "api", "database", "cloud" };

                // Создаём роль User, если её нет
                var userRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
                if (userRole == null)
                {
                    userRole = new Role { Name = "User" };
                    _context.Roles.Add(userRole);
                    await _context.SaveChangesAsync();
                }

                // Генерируем пользователей
                for (int i = 0; i < request.Users; i++)
                {
                    var username = $"{userNames[random.Next(userNames.Length)]}_{random.Next(100, 999)}";
                    var email = $"{username.ToLower()}@{domains[random.Next(domains.Length)]}";
                    var user = new User
                    {
                        Username = username,
                        Email = email,
                        Profile = $"I love coding!",
                        RoleId = userRole.Id.Value
                    };
                    user.SetPassword("Test123!");
                    _context.Users.Add(user);
                }
                await _context.SaveChangesAsync();

                var users = await _context.Users.ToListAsync();

                // Генерируем посты
                foreach (var user in users)
                {
                    for (int p = 0; p < request.PostsPerUser; p++)
                    {
                        var content = string.Join(" ", Enumerable.Range(0, random.Next(10, 30))
                            .Select(_ => words[random.Next(words.Length)]));
                        var post = new Post
                        {
                            UserId = user.Id.Value,
                            Content = content,
                            Type = random.Next(2) == 0 ? PostType.Text : PostType.Interactive
                        };
                        _context.Posts.Add(post);
                    }
                }
                await _context.SaveChangesAsync();

                var posts = await _context.Posts.ToListAsync();

                // Генерируем комментарии
                foreach (var post in posts)
                {
                    for (int c = 0; c < request.CommentsPerPost; c++)
                    {
                        var commenter = users[random.Next(users.Count)];
                        var comment = new Comment
                        {
                            UserId = commenter.Id.Value,
                            PostId = post.Id.Value,
                            Content = $"Nice post! {string.Join(" ", Enumerable.Range(0, random.Next(5, 15))
                                .Select(_ => words[random.Next(words.Length)]))}"
                        };
                        _context.Comments.Add(comment);
                    }
                }
                await _context.SaveChangesAsync();

                // Генерируем реакции
                var possibleReactions = new[] { ReactionType.Like, ReactionType.Dislike };
                foreach (var post in posts)
                {
                    for (int r = 0; r < request.ReactionsPerPost; r++)
                    {
                        var reactor = users[random.Next(users.Count)];
                        var reaction = new Reaction
                        {
                            UserId = reactor.Id.Value,
                            PostId = post.Id,
                            Type = possibleReactions[random.Next(possibleReactions.Length)]
                        };
                        // Проверяем уникальность
                        var exists = await _context.Reactions.AnyAsync(rx =>
                            rx.UserId == reaction.UserId && rx.PostId == reaction.PostId);
                        if (!exists)
                            _context.Reactions.Add(reaction);
                    }
                }
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    UsersCreated = users.Count,
                    PostsCreated = posts.Count,
                    CommentsCreated = request.PostsPerUser * request.CommentsPerPost * request.Users,
                    ReactionsCreated = request.PostsPerUser * request.ReactionsPerPost * request.Users
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error generating test data: {ex.Message}");
            }
        }
    }
}