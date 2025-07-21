using Server.Data.Schema;
using Server.Models;

namespace Server.Services.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(UserDto req);
    Task<string> LoginAsync(UserDto req, HttpContext context);
    Task LogoutAsync(HttpContext context);
    Task DeleteAsync(HttpContext context);
    Task<string> ValidateAndReplaceRefreshTokenAsync(HttpContext context);
    Task<string> ChangeRole(HttpContext context);
}
