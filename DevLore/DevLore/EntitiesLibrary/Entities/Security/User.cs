using Microsoft.AspNetCore.Identity;

namespace DevLore.EntitiesLibrary.Entities.Security
{
    public class User : IdentityUser
    {
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }

    }
}