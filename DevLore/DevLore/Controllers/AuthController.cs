using DevLore.Data;
using DevLore.EntitiesLibrary.Entities.Common;
using DevLore.EntitiesLibrary.Transfer.Auth;
using DevLore.EntitiesLibrary.Transfer.UserTransferLogic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace DevLore.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            // Валидация полей
            if (string.IsNullOrWhiteSpace(request.Username))
                return BadRequest(new { message = "Username is required." });
            if (request.Username.Length < 3)
                return BadRequest(new { message = "Username must be at least 3 characters long." });
            if (request.Username.Length > 32)
                return BadRequest(new { message = "Username must not exceed 50 characters." });

            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email is required." });
            if (!IsValidEmail(request.Email))
                return BadRequest(new { message = "Invalid email format." });
            if (request.Email.Length > 256)
                return BadRequest(new { message = "Email must not exceed 256 characters." });

            if (string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Password is required." });
            if (request.Password.Length < 8)
                return BadRequest(new { message = "Password must be at least 8 characters long." });
            if (request.Password.Length > 100)
                return BadRequest(new { message = "Password must not exceed 100 characters." });

            // Проверка уникальности email и username
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "User with this email already exists." });
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest(new { message = "User with this username already exists." });

            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
            if (defaultRole == null)
            {
                defaultRole = new Role { Name = "User" };
                _context.Roles.Add(defaultRole);
                await _context.SaveChangesAsync();
            }

            var roleId = defaultRole.Id ?? throw new Exception("Role Id is null");

            try
            {
                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    RoleId = roleId,
                    Profile = ""
                };
                user.SetPassword(request.Password);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(user);
                var userDto = user.ToDTO();
                return Ok(new AuthResponse { Token = token, User = userDto });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Registration failed due to internal error." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email is required." });
            if (string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Password is required." });

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !user.VerifyPassword(request.Password))
                return Unauthorized(new { message = "Invalid email or password." });

            var token = GenerateJwtToken(user);
            var userDto = user.ToDTO();
            return Ok(new AuthResponse { Token = token, User = userDto });
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == int.Parse(userIdClaim));
            if (user == null)
                return NotFound();

            return Ok(user.ToDTO());
        }

        private string GenerateJwtToken(User user)
        {
            var key = Environment.GetEnvironmentVariable("JWT_KEY") ?? "your-secret-key-at-least-32-characters-long";
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role?.Name ?? "User")
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;
            try
            {
                // Простая проверка формата
                return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase);
            }
            catch
            {
                return false;
            }
        }
    }
}