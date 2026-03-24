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
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("User with this email already exists");

            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
            if (defaultRole == null)
            {
                defaultRole = new Role { Name = "User" };
                _context.Roles.Add(defaultRole);
                await _context.SaveChangesAsync();
            }

            var roleId = request.RoleId ?? defaultRole.Id; // теперь явно int

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                RoleId = roleId.Value, // без ошибки
                Profile = ""
            };
            user.SetPassword(request.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var userDto = user.ToDTO();

            return Ok(new AuthResponse { Token = token, User = userDto });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !user.VerifyPassword(request.Password))
                return Unauthorized("Invalid email or password");

            var token = GenerateJwtToken(user);
            var userDto = user.ToDTO();

            return Ok(new AuthResponse { Token = token, User = userDto });
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
    }
}